"""
Content Service - RAG content retrieval and generation
"""
from typing import Optional, Dict, List
from models.content import Content
from services.firebase_service import firebase_service
import random


class ContentService:
    """Service for psychological content and RAG operations"""
    
    @staticmethod
    def create_content(text: str, type: str, category: str, 
                      tags: List[str] = None) -> Dict:
        """Create new psychological content"""
        try:
            # Generate unique ID
            content_id = firebase_service.create('content', {})
            
            content = Content(
                content_id=content_id,
                text=text,
                type=type,
                category=category,
                tags=tags or []
            )
            
            path = f'content/{content_id}'
            firebase_service.set(path, content.to_dict())
            
            return {
                'success': True,
                'message': 'Content created successfully',
                'content_id': content_id,
                'content': content.to_dict()
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error creating content: {str(e)}'
            }
    
    @staticmethod
    def get_content(content_id: str) -> Dict:
        """Get specific content"""
        try:
            path = f'content/{content_id}'
            data = firebase_service.get(path)
            
            if data:
                content = Content.from_dict(content_id, data)
                return {
                    'success': True,
                    'content': content.to_dict()
                }
            else:
                return {
                    'success': False,
                    'message': 'Content not found'
                }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error getting content: {str(e)}'
            }
    
    @staticmethod
    def get_all_content() -> Dict:
        """Get all content"""
        try:
            path = 'content'
            data = firebase_service.get(path)
            
            if data:
                content_list = []
                for content_id, content_data in data.items():
                    content = Content.from_dict(content_id, content_data)
                    content_list.append(content.to_dict())
                
                return {
                    'success': True,
                    'count': len(content_list),
                    'content': content_list
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
                'message': f'Error getting content: {str(e)}'
            }
    
    @staticmethod
    def get_content_by_category(category: str) -> Dict:
        """Get content by category"""
        try:
            path = 'content'
            data = firebase_service.get(path)
            
            if data:
                filtered_content = []
                for content_id, content_data in data.items():
                    if content_data.get('category', '').lower() == category.lower():
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
                'message': f'Error getting content by category: {str(e)}'
            }
    
    @staticmethod
    def get_content_by_type(content_type: str) -> Dict:
        """Get content by type (Quote, Tip, Affirmation)"""
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
    def search_content_by_tags(tags: List[str]) -> Dict:
        """Search content by tags"""
        try:
            path = 'content'
            data = firebase_service.get(path)
            
            if data:
                matching_content = []
                for content_id, content_data in data.items():
                    content_tags = content_data.get('tags', [])
                    # Check if any tag matches
                    if any(tag.lower() in [t.lower() for t in content_tags] for tag in tags):
                        content = Content.from_dict(content_id, content_data)
                        matching_content.append(content.to_dict())
                
                return {
                    'success': True,
                    'count': len(matching_content),
                    'content': matching_content
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
                'message': f'Error searching content by tags: {str(e)}'
            }
    
    @staticmethod
    def retrieve_relevant_content(user_mood: str = None, user_goals: List[str] = None) -> Dict:
        """
        RAG function: Retrieve relevant content based on user mood and goals
        This is a simplified version - you can enhance with embeddings and vector search
        """
        try:
            path = 'content'
            data = firebase_service.get(path)
            
            if not data:
                return {
                    'success': True,
                    'content': []
                }
            
            # Category mapping based on mood
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
            
            # Limit to 5 random relevant items
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
    def generate_journal_prompt(user_mood: str = None, user_goals: List[str] = None) -> Dict:
        """Generate personalized journal prompt based on user data"""
        try:
            # Predefined prompts based on mood
            mood_prompts = {
                'Anxious': [
                    "What triggered your anxiety today? How did you cope with it?",
                    "Write about three things you can control right now.",
                    "Describe a moment today when you felt calm or at peace."
                ],
                'Stressed': [
                    "What's causing you the most stress right now? Break it down into smaller parts.",
                    "List three things you accomplished today, no matter how small.",
                    "What can you delegate or let go of tomorrow?"
                ],
                'Happy': [
                    "What made you happy today? How can you create more of these moments?",
                    "Write about someone who made you smile today.",
                    "What are you grateful for right now?"
                ],
                'Sad': [
                    "What emotions are you feeling? It's okay to acknowledge them.",
                    "Write a letter to yourself with compassion and kindness.",
                    "What small thing could bring you a bit of comfort right now?"
                ],
                'Tired': [
                    "What drained your energy today? How can you recharge?",
                    "When do you feel most energized? How can you incorporate more of that?",
                    "What does rest look like for you?"
                ],
                'Calm': [
                    "What helped you feel calm today?",
                    "Reflect on a peaceful moment you experienced.",
                    "What practices help you maintain inner peace?"
                ]
            }
            
            # Get prompts for the mood
            prompts = mood_prompts.get(user_mood, [
                "How are you feeling today? What's on your mind?",
                "What did you learn about yourself today?",
                "What are you grateful for today?"
            ])
            
            # Select random prompt
            selected_prompt = random.choice(prompts)
            
            return {
                'success': True,
                'prompt': selected_prompt,
                'mood': user_mood
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error generating prompt: {str(e)}'
            }
    
    @staticmethod
    def get_motivational_quote(category: str = None) -> Dict:
        """Get a random motivational quote"""
        try:
            result = ContentService.get_content_by_type('Quote')
            
            if result['success'] and result['count'] > 0:
                quotes = result['content']
                
                # Filter by category if provided
                if category:
                    quotes = [q for q in quotes if q.get('category', '').lower() == category.lower()]
                
                if quotes:
                    selected_quote = random.choice(quotes)
                    return {
                        'success': True,
                        'quote': selected_quote
                    }
            
            # Fallback quotes
            fallback_quotes = [
                "Every day is a new beginning. Take a deep breath and start again.",
                "You are stronger than you think.",
                "Progress, not perfection.",
                "Be kind to yourself. You're doing the best you can."
            ]
            
            return {
                'success': True,
                'quote': {
                    'text': random.choice(fallback_quotes),
                    'type': 'Quote',
                    'category': 'Motivation'
                }
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error getting quote: {str(e)}'
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
                "Write down 3 things you're grateful for today."
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


content_service = ContentService()