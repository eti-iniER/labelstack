import abc
import polars as pl
from typing import List, Tuple
from django.core.files.uploadedfile import UploadedFile
from core.models import Order, OrderParty, Package, Address, Job
from core.utils import lbs_oz_to_oz
from uuid import uuid4

VALID_CSV_HEADERS = [
    "from_first_name",
    "from_last_name",
    "from_address",
    "from_address_2",
    "from_city",
    "from_zip_code",
    "from_state",
    "to_first_name",
    "to_last_name",
    "to_address",
    "to_address_2",
    "to_city",
    "to_zip_code",
    "to_state",
    "weight_lbs",
    "weight_oz",
    "length",
    "width",
    "height",
    "phone_number",
    "phone_number_2",
    "order_number",
    "item_sku",
]


class ValidationGate(abc.ABC):
    """Base class for all CSV validation rules."""

    @abc.abstractmethod
    def validate(self, data: pl.DataFrame) -> None:
        """
        Should raise a ValueError with a specific message if validation fails.
        """
        pass


class CSVStructureGate(ValidationGate):
    # EXACT snapshot of columns (from the template CSV) to validate against
    # The 'duplicated_0' suffix is automatically added by Polars when there are duplicate column names
    # This is expected behaviour and should be accounted for in the validation
    REQUIRED_COLUMN_SNAPSHOT = [
        "first name",
        "last name",
        "address",
        "address2",
        "city",
        "zip/postal code",
        "abbreviation",
        "first name_duplicated_0",
        "last name_duplicated_0",
        "address_duplicated_0",
        "address2_duplicated_0",
        "city_duplicated_0",
        "zip/postal code_duplicated_0",
        "abbreviation_duplicated_0",
        "lbs",
        "oz",
        "length",
        "width",
        "height",
        "phone num1",
        "phone num2",
        "order no",
        "item-sku",
    ]

    def validate(self, df: pl.DataFrame):
        if len(df.columns) < len(self.REQUIRED_COLUMN_SNAPSHOT):
            raise ValueError(
                "Invalid Structure: CSV has fewer columns than the required template."
            )

        for col in self.REQUIRED_COLUMN_SNAPSHOT:
            if col not in df.columns:
                raise ValueError(
                    f"Invalid Structure: Missing or renamed column '{col}'."
                )


class CSVValidator:
    def __init__(self, gates: List[ValidationGate]):
        self.gates = gates

    def validate(self, data: pl.DataFrame) -> Tuple[bool, List[str]]:
        errors = []

        for gate in self.gates:
            try:
                gate.validate(data)
            except ValueError as e:
                errors.append(str(e))

        return len(errors) == 0, errors


class CSVService:
    def __init__(self, uploaded_csv_file: UploadedFile):
        self.errors = []
        self.df = None

        try:
            uploaded_csv_file.seek(0)
            schema_overrides = {
                "zip/postal code": pl.Utf8,
                "zip/postal code_duplicated_0": pl.Utf8,
                "phone num1": pl.Utf8,
                "phone num2": pl.Utf8,
                "order no": pl.Utf8,
                "item-sku": pl.Utf8,
            }
            self.df = pl.read_csv(
                uploaded_csv_file.file,
                skip_rows=1,
                schema_overrides=schema_overrides,
            )
            self.df.columns = [
                col.strip().lower().replace("*", "") for col in self.df.columns
            ]
        except Exception:
            self.errors.append("The file could not be read as a CSV.")
            return

        passed_pre, pre_errors = self.pre_validate()
        if not passed_pre:
            self.errors.extend(pre_errors)
            return

        new_names = VALID_CSV_HEADERS

        mapping = {old: new for old, new in zip(self.df.columns, new_names)}
        self.df = self.df.rename(mapping)

        passed_post, post_errors = self.post_validate()
        self.errors.extend(post_errors)

    @property
    def is_valid(self):
        return len(self.errors) == 0

    def pre_validate(self):
        """
        Pre-validation step to check CSV structure before deeper validation.
        """
        csv_validator = CSVValidator(gates=[CSVStructureGate()])
        return csv_validator.validate(self.df)

    def post_validate(self):
        """
        Post-validation step to check CSV data integrity after initial processing.
        """
        csv_validator = CSVValidator([])
        return csv_validator.validate(self.df)

    def create_orders(self) -> List[Order]:
        """
        Create Order instances from the validated CSV data.
        """
        job = Job.objects.create()
        from_addresses = []
        to_addresses = []
        senders = []
        recipients = []
        packages = []

        for row in self.df.iter_rows(named=True):
            from_name = (
                f"{row['from_first_name'] or ''} {row['from_last_name'] or ''}".strip()
            )
            from_addresses.append(
                Address(
                    name=from_name,
                    address=row["from_address"],
                    address_2=row["from_address_2"] or "",
                    city=row["from_city"],
                    state=row["from_state"],
                    zip_code=row["from_zip_code"],
                    is_user_created=False,
                )
            )

            to_name = (
                f"{row['to_first_name'] or ''} {row['to_last_name'] or ''}".strip()
            )
            to_addresses.append(
                Address(
                    name=to_name,
                    address=row["to_address"],
                    address_2=row["to_address_2"] or "",
                    city=row["to_city"],
                    state=row["to_state"],
                    zip_code=row["to_zip_code"],
                    is_user_created=False,
                )
            )

            senders.append(
                OrderParty(
                    first_name=row["from_first_name"],
                    last_name=row["from_last_name"] or "",
                )
            )

            recipients.append(
                OrderParty(
                    first_name=row["to_first_name"],
                    last_name=row["to_last_name"] or "",
                )
            )

            weight_lbs = int(row["weight_lbs"]) if row["weight_lbs"] else 0
            weight_oz = int(row["weight_oz"]) if row["weight_oz"] else 0
            total_weight_oz = lbs_oz_to_oz(weight_lbs, weight_oz)

            packages.append(
                Package(
                    length=int(row["length"]),
                    width=int(row["width"]),
                    height=int(row["height"]),
                    weight=total_weight_oz,
                    item_sku=row["item_sku"] or "",
                    is_user_created=False,
                )
            )

        from_addresses = Address.objects.bulk_create(from_addresses)
        to_addresses = Address.objects.bulk_create(to_addresses)
        senders = OrderParty.objects.bulk_create(senders)
        recipients = OrderParty.objects.bulk_create(recipients)
        packages = Package.objects.bulk_create(packages)

        orders = []
        for i, row in enumerate(self.df.iter_rows(named=True)):
            orders.append(
                Order(
                    job=job,
                    sender=senders[i],
                    recipient=recipients[i],
                    from_address=from_addresses[i],
                    to_address=to_addresses[i],
                    package=packages[i],
                    phone_number=row["phone_number"] or "",
                    phone_number_2=row["phone_number_2"] or "",
                )
            )

        order_instances = Order.objects.bulk_create(orders)
        return order_instances
