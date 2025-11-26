from typing import Optional, Dict, List
from models.user import User
from services.firebase_service import firebase_service

class UserService:
    
    @staticmethod
    def create_user_profile(user_id: str, email: str, username: str, 
                           age: int, goals: List[str] = None) -> Dict:
        try:
            user = User(
                user_id=user_id,
                email=email,
                password_hash="",  
                username=username,
                age=age,
                goals=goals or []
            )
            
            path = f'users/{user_id}'
            firebase_service.set(path, user.to_dict())
            
            return {
                'success': True,
                'message': 'User profile created successfully',
                'user': user.to_dict()
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error creating user profile: {str(e)}'
            }
    
    @staticmethod
    def get_user_profile(user_id: str) -> Optional[Dict]:
        try:
            path = f'users/{user_id}'
            data = firebase_service.get(path)
            
            if data:
                user = User.from_dict(user_id, data)
                return {
                    'success': True,
                    'user': user.to_dict()
                }
            else:
                return {
                    'success': False,
                    'message': 'User not found'
                }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error getting user: {str(e)}'
            }
    
user_service = UserService()