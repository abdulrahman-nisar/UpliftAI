"""
Mood Service - Mood tracking operations
"""
from typing import Optional, Dict, List
from models.mood_entry import MoodEntry
from services.firebase_service import firebase_service
from datetime import datetime, timedelta


class MoodService:
    """Service for mood tracking operations"""
    
    @staticmethod
    def create_mood_entry(user_id: str, date: str, mood: str, 
                         energy: str, notes: str = None) -> Dict:
        """Create a new mood entry"""
        try:
            # Generate unique ID
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
    def get_mood_entry(user_id: str, entry_id: str) -> Dict:
        """Get a specific mood entry"""
        try:
            path = f'moods/{user_id}/{entry_id}'
            data = firebase_service.get(path)
            
            if data:
                mood_entry = MoodEntry.from_dict(entry_id, data)
                return {
                    'success': True,
                    'mood_entry': mood_entry.to_dict()
                }
            else:
                return {
                    'success': False,
                    'message': 'Mood entry not found'
                }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error getting mood entry: {str(e)}'
            }
    
    @staticmethod
    def get_user_moods(user_id: str, limit: int = None) -> Dict:
        """Get all mood entries for a user"""
        try:
            path = f'moods/{user_id}'
            data = firebase_service.get(path)
            
            if data:
                mood_list = []
                for entry_id, entry_data in data.items():
                    mood_entry = MoodEntry.from_dict(entry_id, entry_data)
                    mood_list.append(mood_entry.to_dict())
                
                # Sort by date (most recent first)
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
    
    @staticmethod
    def get_moods_by_date_range(user_id: str, start_date: str, end_date: str) -> Dict:
        """Get mood entries within a date range"""
        try:
            path = f'moods/{user_id}'
            data = firebase_service.get(path)
            
            if data:
                filtered_moods = []
                for entry_id, entry_data in data.items():
                    entry_date = entry_data.get('date', '')
                    if start_date <= entry_date <= end_date:
                        mood_entry = MoodEntry.from_dict(entry_id, entry_data)
                        filtered_moods.append(mood_entry.to_dict())
                
                filtered_moods.sort(key=lambda x: x['date'])
                
                return {
                    'success': True,
                    'count': len(filtered_moods),
                    'moods': filtered_moods
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
                'message': f'Error getting moods by date range: {str(e)}'
            }
    
    @staticmethod
    def update_mood_entry(user_id: str, entry_id: str, data: Dict) -> Dict:
        """Update a mood entry"""
        try:
            path = f'moods/{user_id}/{entry_id}'
            
            # Check if entry exists
            existing = firebase_service.get(path)
            if not existing:
                return {
                    'success': False,
                    'message': 'Mood entry not found'
                }
            
            # Update allowed fields
            update_data = {}
            allowed_fields = ['mood', 'energy', 'notes']
            
            for field in allowed_fields:
                if field in data:
                    update_data[field] = data[field]
            
            firebase_service.update(path, update_data)
            
            return {
                'success': True,
                'message': 'Mood entry updated successfully'
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error updating mood entry: {str(e)}'
            }
    
    @staticmethod
    def delete_mood_entry(user_id: str, entry_id: str) -> Dict:
        """Delete a mood entry"""
        try:
            path = f'moods/{user_id}/{entry_id}'
            firebase_service.delete(path)
            
            return {
                'success': True,
                'message': 'Mood entry deleted successfully'
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error deleting mood entry: {str(e)}'
            }
    
    @staticmethod
    def get_mood_statistics(user_id: str, days: int = 7) -> Dict:
        """Get mood statistics for the last N days"""
        try:
            path = f'moods/{user_id}'
            data = firebase_service.get(path)
            
            if not data:
                return {
                    'success': True,
                    'statistics': {
                        'total_entries': 0,
                        'mood_distribution': {},
                        'energy_distribution': {},
                        'most_common_mood': None,
                        'average_energy': None
                    }
                }
            
            # Calculate date threshold
            today = datetime.now()
            threshold_date = (today - timedelta(days=days)).strftime('%Y-%m-%d')
            
            mood_counts = {}
            energy_counts = {}
            total_entries = 0
            
            for entry_id, entry_data in data.items():
                entry_date = entry_data.get('date', '')
                if entry_date >= threshold_date:
                    total_entries += 1
                    
                    # Count moods
                    mood = entry_data.get('mood', 'Unknown')
                    mood_counts[mood] = mood_counts.get(mood, 0) + 1
                    
                    # Count energy levels
                    energy = entry_data.get('energy', 'Unknown')
                    energy_counts[energy] = energy_counts.get(energy, 0) + 1
            
            # Find most common mood
            most_common_mood = max(mood_counts, key=mood_counts.get) if mood_counts else None
            
            return {
                'success': True,
                'statistics': {
                    'total_entries': total_entries,
                    'mood_distribution': mood_counts,
                    'energy_distribution': energy_counts,
                    'most_common_mood': most_common_mood,
                    'days_analyzed': days
                }
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error calculating statistics: {str(e)}'
            }


mood_service = MoodService()