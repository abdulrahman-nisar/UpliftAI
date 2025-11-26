from typing import Dict, List
from models.content import Content
from services.firebase_service import firebase_service
import random

class ContentService:

    @staticmethod
    def get_content_by_type(content_type: str) -> Dict:
        try:
            path = 'content'
            data = firebase_service.get(path)
            
            if data:
                filtered_content = []
                for content_id, content_data in data.items():
                    if content_data.get('type', '').lower() == content_type.lower():
                        content = Content.from_dict(content_id, content_data)
                        filtered_content.append(content.to_dict())
                
                return {
                    'success': True,
                    'count': len(filtered_content),
                    'content': filtered_content
                }
            else:
                return {
                    'success': True,
                    'count': 0,
                    'content': []
                }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error getting content by type: {str(e)}'
            }
    

    @staticmethod
    def retrieve_relevant_content(user_mood: str = None, user_goals: List[str] = None) -> Dict:
        try:
            path = 'content'
            data = firebase_service.get(path)
            
            if not data:
                return {
                    'success': True,
                    'content': []
                }
            
           
            mood_category_map = {
                'Anxious': ['Stress', 'Mindfulness'],
                'Stressed': ['Stress', 'Relaxation'],
                'Tired': ['Motivation', 'Energy'],
                'Happy': ['Gratitude', 'Motivation'],
                'Sad': ['Motivation', 'Self-Compassion'],
                'Calm': ['Mindfulness', 'Gratitude']
            }
            
            relevant_categories = mood_category_map.get(user_mood, ['Motivation'])
            
            relevant_content = []
            for content_id, content_data in data.items():
                category = content_data.get('category', '')
                if category in relevant_categories:
                    content = Content.from_dict(content_id, content_data)
                    relevant_content.append(content.to_dict())
            
            if len(relevant_content) > 5:
                relevant_content = random.sample(relevant_content, 5)
            
            return {
                'success': True,
                'count': len(relevant_content),
                'content': relevant_content
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error retrieving relevant content: {str(e)}'
            }

    @staticmethod
    def get_wellness_tips(user_mood: str = None) -> Dict:
        """Get wellness tips based on user mood"""
        try:
            result = ContentService.get_content_by_type('Tip')
            
            if result['success'] and result['count'] > 0:
                tips = result['content']
                
                # You can add mood-based filtering here
                selected_tips = random.sample(tips, min(3, len(tips)))
                
                return {
                    'success': True,
                    'tips': selected_tips
                }
            
            # Fallback tips
            fallback_tips = [
                "Take 5 deep breaths when feeling overwhelmed.",
                "Drink a glass of water and stretch for 2 minutes.",
                "Write down 3 things you're grateful for today.",
                "Take a short walk outside to clear your mind.",
                "Practice a quick mindfulness exercise for 5 minutes."

            ]
            
            return {
                'success': True,
                'tips': [{'text': tip, 'type': 'Tip', 'category': 'Wellness'} for tip in fallback_tips]
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error getting tips: {str(e)}'
            }    
    @staticmethod
    def get_motivational_quote(category: str = None) -> Dict:    
            # Fallback quotes
            fallback_quotes = [
                {"text": "Every day is a new beginning. Take a deep breath and start again.", "author": "Unknown"},
                {"text": "You are stronger than you think.", "author": "Unknown"},
                {"text": "Progress, not perfection.", "author": "Unknown"},
                {"text": "Be kind to yourself. You're doing the best you can.", "author": "Unknown"},
                {"text": "The only way to do great work is to love what you do.", "author": "Steve Jobs"},
                {"text": "Believe you can and you're halfway there.", "author": "Theodore Roosevelt"},
                {"text": "Don't watch the clock; do what it does. Keep going.", "author": "Sam Levenson"}
            ]
            
            selected_fallback = random.choice(fallback_quotes)
            return {
                'success': True,
                'quote': {
                    'text': selected_fallback['text'],
                    'author': selected_fallback['author'],
                    'type': 'Quote',
                    'category': 'Motivation'
                }
            }    

content_service = ContentService()