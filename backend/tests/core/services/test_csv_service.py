import pytest
import pathlib
from django.core.files.uploadedfile import SimpleUploadedFile
from core.services.csv_service import CSVService
from core.models import Order, OrderParty, Package, Address


@pytest.fixture
def csv_data_path():
    """Fixture to return the absolute path to the test data folder."""
    return pathlib.Path(__file__).parent.parent.parent / "data"


@pytest.fixture
def valid_csv_file(csv_data_path) -> SimpleUploadedFile:
    """Fixture that returns a Django SimpleUploadedFile object."""
    file_path = csv_data_path / "template.csv"
    with open(file_path, "rb") as f:
        return SimpleUploadedFile(
            name=file_path, content=f.read(), content_type="text/csv"
        )


def test_csv_service_initialization_success(valid_csv_file: SimpleUploadedFile):
    service = CSVService(valid_csv_file)

    assert service.is_valid is True, "CSVService should be valid for a correct CSV."
    assert len(service.errors) == 0, f"Unexpected errors: {service.errors}"
    assert (
        "to_first_name" in service.df.columns
    ), "Expected column 'to_first_name' not found."


def test_invalid_header_fails():
    bad_content = b"Wrong,Header,Structure\nValue1,Value2,Value3"
    fake_file = SimpleUploadedFile("bad.csv", bad_content, content_type="text/csv")

    service = CSVService(fake_file)
    assert service.is_valid is False, "CSVService should be invalid for bad headers."
    assert len(service.errors) == 1, "Expected one error for bad headers."
    assert "Invalid Structure" in service.errors[0]


@pytest.mark.django_db
def test_create_orders_from_valid_csv():
    csv_content = b"""Header Row (ignored by CSVService)
first name,last name,address,address2,city,zip/postal code,abbreviation,first name,last name,address,address2,city,zip/postal code,abbreviation,lbs,oz,length,width,height,phone num1,phone num2,order no,item-sku
John,Doe,123 Main St,Apt 4,New York,10001,NY,Jane,Smith,456 Oak Ave,Suite 100,Los Angeles,90001,CA,5,8,10,8,6,555-1234,555-5678,ORD-001,SKU-123
Alice,Johnson,789 Pine Rd,,Chicago,60601,IL,Bob,Williams,321 Elm St,,Houston,77001,TX,3,4,12,10,8,555-9876,555-4321,ORD-002,SKU-456
"""

    uploaded_file = SimpleUploadedFile("test.csv", csv_content, content_type="text/csv")
    service = CSVService(uploaded_file)

    assert service.is_valid is True, "CSVService should be valid for template CSV"

    initial_order_count = Order.objects.count()
    initial_address_count = Address.objects.count()
    initial_party_count = OrderParty.objects.count()
    initial_package_count = Package.objects.count()

    orders = service.create_orders()

    expected_rows = len(service.df)
    assert (
        len(orders) == expected_rows
    ), f"Expected {expected_rows} orders to be created"
    assert Order.objects.count() == initial_order_count + expected_rows
    assert Address.objects.count() == initial_address_count + (expected_rows * 2)
    assert OrderParty.objects.count() == initial_party_count + (expected_rows * 2)
    assert Package.objects.count() == initial_package_count + expected_rows

    first_order = orders[0]
    assert first_order.sender is not None
    assert first_order.recipient is not None
    assert first_order.from_address is not None
    assert first_order.to_address is not None
    assert first_order.package is not None

    assert first_order.from_address.is_user_created is False
    assert first_order.to_address.is_user_created is False
    assert first_order.package.is_user_created is False

    assert first_order.sender.first_name == "John"
    assert first_order.sender.last_name == "Doe"
    assert first_order.recipient.first_name == "Jane"
    assert first_order.recipient.last_name == "Smith"

    assert first_order.from_address.name == "John Doe"
    assert first_order.from_address.address == "123 Main St"
    assert first_order.from_address.address_2 == "Apt 4"
    assert first_order.from_address.city == "New York"
    assert first_order.from_address.state == "NY"
    assert first_order.from_address.zip_code == "10001"

    assert first_order.to_address.name == "Jane Smith"
    assert first_order.to_address.address == "456 Oak Ave"
    assert first_order.to_address.address_2 == "Suite 100"
    assert first_order.to_address.city == "Los Angeles"
    assert first_order.to_address.state == "CA"
    assert first_order.to_address.zip_code == "90001"

    assert first_order.package.length == 10
    assert first_order.package.width == 8
    assert first_order.package.height == 6
    assert first_order.package.weight == 88
    assert first_order.package.item_sku == "SKU-123"

    assert first_order.phone_number == "555-1234"
    assert first_order.phone_number_2 == "555-5678"

    second_order = orders[1]
    assert second_order.sender.first_name == "Alice"
    assert second_order.sender.last_name == "Johnson"
    assert second_order.recipient.first_name == "Bob"
    assert second_order.recipient.last_name == "Williams"

    assert second_order.from_address.name == "Alice Johnson"
    assert second_order.from_address.address == "789 Pine Rd"
    assert second_order.from_address.address_2 == ""
    assert second_order.from_address.city == "Chicago"
    assert second_order.from_address.state == "IL"
    assert second_order.from_address.zip_code == "60601"

    assert second_order.to_address.name == "Bob Williams"
    assert second_order.to_address.address == "321 Elm St"
    assert second_order.to_address.address_2 == ""
    assert second_order.to_address.city == "Houston"
    assert second_order.to_address.state == "TX"
    assert second_order.to_address.zip_code == "77001"

    assert second_order.package.length == 12
    assert second_order.package.width == 10
    assert second_order.package.height == 8
    assert second_order.package.weight == 52
    assert second_order.package.item_sku == "SKU-456"

    assert second_order.phone_number == "555-9876"
    assert second_order.phone_number_2 == "555-4321"
