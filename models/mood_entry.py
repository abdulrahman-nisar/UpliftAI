from datetime import datetime
from typing import Optional

class MoodEntry:

    def __init__(
        self,
        entry_id: str,
        user_id: str,
        date: str,
        mood: str,  # "Happy", "Sad", "Anxious", "Calm", "Stressed"
        energy: str,  # "Low", "Medium", "High"
        notes: Optional[str] = None,
        created_at: Optional[str] = None
    ):
        self.entry_id = entry_id
        self.user_id = user_id
        self.date = date
        self.mood = mood
        self.energy = energy
        self.notes = notes
        self.created_at = created_at or datetime.utcnow().isoformat()
    
    def to_dict(self) -> dict:
        return {
            'user_id': self.user_id,
            'date': self.date,
            'mood': self.mood,
            'energy': self.energy,
            'notes': self.notes,
            'created_at': self.created_at
        }
    
    @staticmethod
    def from_dict(entry_id: str, data: dict) -> 'MoodEntry':
        return MoodEntry(
            entry_id=entry_id,
            user_id=data.get('user_id'),
            date=data.get('date'),
            mood=data.get('mood'),
            energy=data.get('energy'),
            notes=data.get('notes'),
            created_at=data.get('created_at')
        )