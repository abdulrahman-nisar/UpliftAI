from typing import Dict
from models.mood_entry import MoodEntry
from services.firebase_service import firebase_service

class MoodService:
    
    @staticmethod
    def create_mood_entry(user_id: str, date: str, mood: str, 
                         energy: str, notes: str = None) -> Dict:
        
        try:
            entry_id = firebase_service.create(f'moods/{user_id}', {})
            
            mood_entry = MoodEntry(
                entry_id=entry_id,
                user_id=user_id,
                date=date,
                mood=mood,
                energy=energy,
                notes=notes
            )
            
            path = f'moods/{user_id}/{entry_id}'
            firebase_service.set(path, mood_entry.to_dict())
            
            return {
                'success': True,
                'message': 'Mood entry created successfully',
                'entry_id': entry_id,
                'mood_entry': mood_entry.to_dict()
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error creating mood entry: {str(e)}'
            }
    
    @staticmethod
    def get_user_moods(user_id: str, limit: int = None) -> Dict:
        try:
            path = f'moods/{user_id}'
            data = firebase_service.get(path)
            
            if data:
                mood_list = []
                for entry_id, entry_data in data.items():
                    mood_entry = MoodEntry.from_dict(entry_id, entry_data)
                    mood_list.append(mood_entry.to_dict())
                
                mood_list.sort(key=lambda x: x['created_at'], reverse=True)
                
                if limit:
                    mood_list = mood_list[:limit]
                
                return {
                    'success': True,
                    'count': len(mood_list),
                    'moods': mood_list
                }
            else:
                return {
                    'success': True,
                    'count': 0,
                    'moods': []
                }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error getting moods: {str(e)}'
            }
    
mood_service = MoodService()