"""
Validation utilities
"""
import re
from typing import Dict, List


def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_required_fields(data: Dict, required_fields: List[str]) -> bool:
    """Check if all required fields are present"""
    return all(field in data and data[field] for field in required_fields)


def validate_mood(mood: str) -> bool:
    """Validate mood value"""
    valid_moods = ['Happy', 'Sad', 'Anxious', 'Calm', 'Stressed', 'Tired', 'Excited']
    return mood in valid_moods


def validate_energy(energy: str) -> bool:
    """Validate energy level"""
    valid_energy = ['Low', 'Medium', 'High']
    return energy in valid_energy


def validate_date(date_str: str) -> bool:
    """Validate date format (YYYY-MM-DD)"""
    pattern = r'^\d{4}-\d{2}-\d{2}$'
    return bool(re.match(pattern, date_str))


def validate_activity_type(activity_type: str) -> bool:
    """Validate activity type"""
    valid_types = ['Physical', 'Mental', 'Spiritual']
    return activity_type in valid_types


def validate_content_type(content_type: str) -> bool:
    """Validate content type"""
    valid_types = ['Quote', 'Tip', 'Affirmation', 'Article']
    return content_type in valid_types


def validate_age(age: int) -> bool:
    """Validate age (12-30 for your app)"""
    return 12 <= age <= 30