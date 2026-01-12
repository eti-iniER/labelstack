import pytest

from core.utils import lbs_oz_to_oz


class TestLbsOzToOz:
    @pytest.mark.parametrize(
        "lbs,oz,expected",
        [
            (0, 0, 0),
            (1, 0, 16),
            (0, 8, 8),
            (1, 8, 24),
            (2, 4, 36),
            (5, 12, 92),
            (10, 0, 160),
            (0, 16, 16),
        ],
    )
    def test_lbs_oz_to_oz(self, lbs, oz, expected):
        """Test conversion of pounds and ounces to total ounces."""
        assert lbs_oz_to_oz(lbs, oz) == expected

    def test_lbs_oz_to_oz_defaults(self):
        """Test that default values work correctly."""
        assert lbs_oz_to_oz() == 0
        assert lbs_oz_to_oz(lbs=1) == 16
        assert lbs_oz_to_oz(oz=8) == 8
