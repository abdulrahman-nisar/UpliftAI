from typing import List, Optional

class Activity:

    def __init__(
        self,
        activity_id: str,
        name: str,
        type: str,  # "Physical", "Mental", "Spiritual"
        duration: int,  # minutes
        description: Optional[str] = None
    ):
        self.activity_id = activity_id
        self.name = name
        self.type = type
        self.duration = duration
        self.description = description
    
    def to_dict(self) -> dict:
        return {
            'name': self.name,
            'type': self.type,
            'duration': self.duration,
            'description': self.description
        }
    
    @staticmethod
    def from_dict(activity_id: str, data: dict) -> 'Activity':
        return Activity(
            activity_id=activity_id,
            name=data.get('name'),
            type=data.get('type'),
            duration=data.get('duration'),
            description=data.get('description')
        )