from typing import Optional, Dict, List
from models.user import User
from services.firebase_service import firebase_service
from datetime import datetime


class UserService:
    """Service for user profile operations"""
    
    @staticmethod
    def create_user_profile(user_id: str, email: str, username: str, 
                           age: int, goals: List[str] = None) -> Dict:
        """Create user profile after Firebase Auth signup"""
        try:
            user = User(
                user_id=user_id,
                email=email,
                password_hash="",  # Not stored (handled by Firebase Auth)
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
        """Get user profile by user_id"""
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
    
    @staticmethod
    def update_user_profile(user_id: str, data: Dict) -> Dict:
        """Update user profile"""
        try:
            path = f'users/{user_id}'
            
            # Get existing user
            existing = firebase_service.get(path)
            if not existing:
                return {
                    'success': False,
                    'message': 'User not found'
                }
            
            # Update only provided fields
            update_data = {}
            allowed_fields = ['username', 'age', 'goals']
            
            for field in allowed_fields:
                if field in data:
                    update_data[field] = data[field]
            
            firebase_service.update(path, update_data)
            
            return {
                'success': True,
                'message': 'User profile updated successfully'
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error updating user: {str(e)}'
            }
    
    @staticmethod
    def update_user_goals(user_id: str, goals: List[str]) -> Dict:
        """Update user's psychological goals"""
        try:
            path = f'users/{user_id}'
            firebase_service.update(path, {'goals': goals})
            
            return {
                'success': True,
                'message': 'Goals updated successfully'
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error updating goals: {str(e)}'
            }
    
    @staticmethod
    def get_user_goals(user_id: str) -> Dict:
        """Get user's goals"""
        try:
            path = f'users/{user_id}'
            data = firebase_service.get(path)
            
            if data and 'goals' in data:
                return {
                    'success': True,
                    'goals': data['goals']
                }
            else:
                return {
                    'success': False,
                    'message': 'Goals not found'
                }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error getting goals: {str(e)}'
            }
    
    @staticmethod
    def delete_user_profile(user_id: str) -> Dict:
        """Delete user profile"""
        try:
            path = f'users/{user_id}'
            firebase_service.delete(path)
            
            return {
                'success': True,
                'message': 'User profile deleted successfully'
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error deleting user: {str(e)}'
            }


user_service = UserService()