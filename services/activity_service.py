from typing import Optional, Dict, List
from models.activity import Activity
from services.firebase_service import firebase_service


class ActivityService:

    @staticmethod
    def create_activity(name: str, type: str, duration: int, 
                       description: str = None) -> Dict:

        try:
            # Generate unique ID
            activity_id = firebase_service.create('activities', {})
            
            activity = Activity(
                activity_id=activity_id,
                name=name,
                type=type,
                duration=duration,
                description=description
            )
            
            path = f'activities/{activity_id}'
            firebase_service.set(path, activity.to_dict())
            
            return {
                'success': True,
                'message': 'Activity created successfully',
                'activity_id': activity_id,
                'activity': activity.to_dict()
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error creating activity: {str(e)}'
            }
    
    @staticmethod
    def get_activity(activity_id: str) -> Dict:
        try:
            path = f'activities/{activity_id}'
            data = firebase_service.get(path)
            
            if data:
                activity = Activity.from_dict(activity_id, data)
                return {
                    'success': True,
                    'activity': activity.to_dict()
                }
            else:
                return {
                    'success': False,
                    'message': 'Activity not found'
                }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error getting activity: {str(e)}'
            }
    
    @staticmethod
    def get_all_activities() -> Dict:
        try:
            path = 'activities'
            data = firebase_service.get(path)
            
            if data:
                activity_list = []
                for activity_id, activity_data in data.items():
                    activity = Activity.from_dict(activity_id, activity_data)
                    activity_list.append(activity.to_dict())
                
                return {
                    'success': True,
                    'count': len(activity_list),
                    'activities': activity_list
                }
            else:
                return {
                    'success': True,
                    'count': 0,
                    'activities': []
                }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error getting activities: {str(e)}'
            }
    
    @staticmethod
    def get_activities_by_type(activity_type: str) -> Dict:
        try:
            path = 'activities'
            data = firebase_service.get(path)
            
            if data:
                filtered_activities = []
                for activity_id, activity_data in data.items():
                    if activity_data.get('type', '').lower() == activity_type.lower():
                        activity = Activity.from_dict(activity_id, activity_data)
                        filtered_activities.append(activity.to_dict())
                
                return {
                    'success': True,
                    'count': len(filtered_activities),
                    'activities': filtered_activities
                }
            else:
                return {
                    'success': True,
                    'count': 0,
                    'activities': []
                }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error getting activities by type: {str(e)}'
            }
    
    @staticmethod
    def update_activity(activity_id: str, data: Dict) -> Dict:
        try:
            path = f'activities/{activity_id}'
            
            # Check if activity exists
            existing = firebase_service.get(path)
            if not existing:
                return {
                    'success': False,
                    'message': 'Activity not found'
                }
            
            # Update allowed fields
            update_data = {}
            allowed_fields = ['name', 'type', 'duration', 'description']
            
            for field in allowed_fields:
                if field in data:
                    update_data[field] = data[field]
            
            firebase_service.update(path, update_data)
            
            return {
                'success': True,
                'message': 'Activity updated successfully'
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error updating activity: {str(e)}'
            }
    
    @staticmethod
    def delete_activity(activity_id: str) -> Dict:
        try:
            path = f'activities/{activity_id}'
            firebase_service.delete(path)
            
            return {
                'success': True,
                'message': 'Activity deleted successfully'
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error deleting activity: {str(e)}'
            }
    
    @staticmethod
    def get_recommended_activities(mood: str = None, goals: List[str] = None) -> Dict:
        try:
            # This is a simple recommendation system
            # You can enhance this with ML later
            path = 'activities'
            data = firebase_service.get(path)
            
            if not data:
                return {
                    'success': True,
                    'count': 0,
                    'activities': []
                }
            
            # Simple mood-based recommendations
            mood_activity_map = {
                'Anxious': ['Mental', 'Spiritual'],
                'Stressed': ['Physical', 'Spiritual'],
                'Tired': ['Physical'],
                'Happy': ['Physical', 'Mental'],
                'Sad': ['Physical', 'Mental']
            }
            
            recommended_types = mood_activity_map.get(mood, ['Physical', 'Mental', 'Spiritual'])
            
            recommended_activities = []
            for activity_id, activity_data in data.items():
                if activity_data.get('type') in recommended_types:
                    activity = Activity.from_dict(activity_id, activity_data)
                    recommended_activities.append(activity.to_dict())
            
            return {
                'success': True,
                'count': len(recommended_activities),
                'activities': recommended_activities
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error getting recommendations: {str(e)}'
            }


activity_service = ActivityService()