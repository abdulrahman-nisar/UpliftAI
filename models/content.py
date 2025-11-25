from typing import List, Optional

class Content:

    def __init__(
        self,
        content_id: str,
        text: str,
        type: str,  # "Quote", "Tip", "Affirmation"
        category: str,  # "Stress", "Motivation", "Gratitude"
        tags: Optional[List[str]] = None,
        author: Optional[str] = None
    ):
        self.content_id = content_id
        self.text = text
        self.type = type
        self.category = category
        self.tags = tags or []
        self.author = author
    
    def to_dict(self) -> dict:
        return {
            'text': self.text,
            'type': self.type,
            'category': self.category,
            'tags': self.tags,
            'author': self.author
        }
    
    @staticmethod
    def from_dict(content_id: str, data: dict) -> 'Content':
        return Content(
            content_id=content_id,
            text=data.get('text'),
            type=data.get('type'),
            category=data.get('category'),
            tags=data.get('tags', []),
            author=data.get('author')
        )