from typing import Dict
from services.firebase_service import firebase_service

class ActivityService:
  
    @staticmethod
    def log_user_activity(user_id: str, activity_data: Dict) -> Dict:
        try:
            path = f'user_activities/{user_id}'
           
            if 'timestamp' not in activity_data:
                from datetime import datetime
                activity_data['timestamp'] = datetime.now().isoformat()
                
            activity_id = firebase_service.create(path, activity_data)
            
            return {
                'success': True,
                'message': 'Activity logged successfully',
                'id': activity_id,
                'data': activity_data
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error logging activity: {str(e)}'
            }

    @staticmethod
    def get_user_activities(user_id: str) -> Dict:
        try:
            path = f'user_activities/{user_id}'
            data = firebase_service.get(path)
            
            activities = []
            if data:
                for key, value in data.items():
                    value['id'] = key
                    activities.append(value)
                
                activities.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
                
            return {
                'success': True,
                'activities': activities,
                'count': len(activities)
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error getting user activities: {str(e)}'
            }

activity_service = ActivityService()