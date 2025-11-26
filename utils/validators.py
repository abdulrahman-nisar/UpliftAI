import re
from typing import Dict, List

def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_required_fields(data: Dict, required_fields: List[str]) -> bool:
    return all(field in data and data[field] for field in required_fields)