def lbs_oz_to_oz(lbs: int = 0, oz: int = 0) -> int:
    """
    Convert pounds and ounces to total ounces.

    Args:
        lbs: Weight in pounds (default: 0)
        oz: Weight in ounces (default: 0)

    Returns:
        Total weight in ounces
    """
    return (lbs * 16) + oz
