"""
Simplified Psychological Content Model
"""
from typing import List, Optional


class Content:
    """Tips, quotes, affirmations for RAG retrieval"""
    
    def __init__(
        self,
        content_id: str,
        text: str,
        type: str,  # "Quote", "Tip", "Affirmation"
        category: str,  # "Stress", "Motivation", "Gratitude"
        tags: Optional[List[str]] = None
    ):
        self.content_id = content_id
        self.text = text
        self.type = type
        self.category = category
        self.tags = tags or []
    
    def to_dict(self) -> dict:
        return {
            'text': self.text,
            'type': self.type,
            'category': self.category,
            'tags': self.tags
        }
    
    @staticmethod
    def from_dict(content_id: str, data: dict) -> 'Content':
        return Content(
            content_id=content_id,
            text=data.get('text'),
            type=data.get('type'),
            category=data.get('category'),
            tags=data.get('tags', [])
        )