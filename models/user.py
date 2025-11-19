"""
Simplified User Model for Firebase
"""
from datetime import datetime
from typing import Optional, List


class User:
    """Core user model with profile"""
    
    def __init__(
        self,
        user_id: str,
        email: str,
        password_hash: str,
        username: str,
        age: int,
        goals: Optional[List[str]] = None,
        created_at: Optional[str] = None
    ):
        self.user_id = user_id
        self.email = email
        self.password_hash = password_hash
        self.username = username
        self.age = age
        self.goals = goals or []  # ["mental_clarity", "stress_relief"]
        self.created_at = created_at or datetime.utcnow().isoformat()
    
    def to_dict(self) -> dict:
        return {
            'email': self.email,
            'password_hash': self.password_hash,
            'username': self.username,
            'age': self.age,
            'goals': self.goals,
            'created_at': self.created_at
        }
    
    @staticmethod
    def from_dict(user_id: str, data: dict) -> 'User':
        return User(
            user_id=user_id,
            email=data.get('email'),
            password_hash=data.get('password_hash'),
            username=data.get('username'),
            age=data.get('age'),
            goals=data.get('goals', []),
            created_at=data.get('created_at')
        )