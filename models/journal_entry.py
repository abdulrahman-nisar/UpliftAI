"""
Simplified Journal Entry Model
"""
from datetime import datetime
from typing import Optional


class JournalEntry:
    """Daily journal entries"""
    
    def __init__(
        self,
        journal_id: str,
        user_id: str,
        date: str,
        content: str,
        prompt: Optional[str] = None,
        created_at: Optional[str] = None
    ):
        self.journal_id = journal_id
        self.user_id = user_id
        self.date = date
        self.content = content
        self.prompt = prompt
        self.created_at = created_at or datetime.utcnow().isoformat()
    
    def to_dict(self) -> dict:
        return {
            'user_id': self.user_id,
            'date': self.date,
            'content': self.content,
            'prompt': self.prompt,
            'created_at': self.created_at
        }
    
    @staticmethod
    def from_dict(journal_id: str, data: dict) -> 'JournalEntry':
        return JournalEntry(
            journal_id=journal_id,
            user_id=data.get('user_id'),
            date=data.get('date'),
            content=data.get('content'),
            prompt=data.get('prompt'),
            created_at=data.get('created_at')
        )