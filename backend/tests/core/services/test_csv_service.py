import pytest
import pathlib
from django.core.files.uploadedfile import SimpleUploadedFile
from core.services.csv_service import CSVService


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
