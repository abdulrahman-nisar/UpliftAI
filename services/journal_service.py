from typing import Dict
from models.journal_entry import JournalEntry
from services.firebase_service import firebase_service
from datetime import datetime


class JournalService:
    """Service for journal operations"""
    
    @staticmethod
    def create_journal_entry(user_id: str, date: str, content: str, 
                            prompt: str = None) -> Dict:
        """Create a new journal entry"""
        try:
            # Generate unique ID
            journal_id = firebase_service.create(f'journals/{user_id}', {})
            
            journal_entry = JournalEntry(
                journal_id=journal_id,
                user_id=user_id,
                date=date,
                content=content,
                prompt=prompt
            )
            
            path = f'journals/{user_id}/{journal_id}'
            firebase_service.set(path, journal_entry.to_dict())
            
            return {
                'success': True,
                'message': 'Journal entry created successfully',
                'journal_id': journal_id,
                'journal_entry': journal_entry.to_dict()
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error creating journal entry: {str(e)}'
            }
    
    @staticmethod
    def get_journal_entry(user_id: str, journal_id: str) -> Dict:
        """Get a specific journal entry"""
        try:
            path = f'journals/{user_id}/{journal_id}'
            data = firebase_service.get(path)
            
            if data:
                journal_entry = JournalEntry.from_dict(journal_id, data)
                return {
                    'success': True,
                    'journal_entry': journal_entry.to_dict()
                }
            else:
                return {
                    'success': False,
                    'message': 'Journal entry not found'
                }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error getting journal entry: {str(e)}'
            }
    
    @staticmethod
    def get_user_journals(user_id: str, limit: int = None) -> Dict:
        """Get all journal entries for a user"""
        try:
            path = f'journals/{user_id}'
            data = firebase_service.get(path)
            
            if data:
                journal_list = []
                for journal_id, journal_data in data.items():
                    journal_entry = JournalEntry.from_dict(journal_id, journal_data)
                    journal_list.append(journal_entry.to_dict())
                
                # Sort by date (most recent first)
                journal_list.sort(key=lambda x: x['created_at'], reverse=True)
                
                if limit:
                    journal_list = journal_list[:limit]
                
                return {
                    'success': True,
                    'count': len(journal_list),
                    'journals': journal_list
                }
            else:
                return {
                    'success': True,
                    'count': 0,
                    'journals': []
                }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error getting journals: {str(e)}'
            }
    
    @staticmethod
    def get_journals_by_date_range(user_id: str, start_date: str, end_date: str) -> Dict:
        """Get journal entries within a date range"""
        try:
            path = f'journals/{user_id}'
            data = firebase_service.get(path)
            
            if data:
                filtered_journals = []
                for journal_id, journal_data in data.items():
                    entry_date = journal_data.get('date', '')
                    if start_date <= entry_date <= end_date:
                        journal_entry = JournalEntry.from_dict(journal_id, journal_data)
                        filtered_journals.append(journal_entry.to_dict())
                
                filtered_journals.sort(key=lambda x: x['date'])
                
                return {
                    'success': True,
                    'count': len(filtered_journals),
                    'journals': filtered_journals
                }
            else:
                return {
                    'success': True,
                    'count': 0,
                    'journals': []
                }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error getting journals by date range: {str(e)}'
            }
    
    @staticmethod
    def update_journal_entry(user_id: str, journal_id: str, data: Dict) -> Dict:
        """Update a journal entry"""
        try:
            path = f'journals/{user_id}/{journal_id}'
            
            # Check if entry exists
            existing = firebase_service.get(path)
            if not existing:
                return {
                    'success': False,
                    'message': 'Journal entry not found'
                }
            
            # Update allowed fields
            update_data = {}
            allowed_fields = ['content', 'prompt']
            
            for field in allowed_fields:
                if field in data:
                    update_data[field] = data[field]
            
            # Add updated timestamp
            update_data['updated_at'] = datetime.utcnow().isoformat()
            
            firebase_service.update(path, update_data)
            
            return {
                'success': True,
                'message': 'Journal entry updated successfully'
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error updating journal entry: {str(e)}'
            }
    
    @staticmethod
    def delete_journal_entry(user_id: str, journal_id: str) -> Dict:
        """Delete a journal entry"""
        try:
            path = f'journals/{user_id}/{journal_id}'
            firebase_service.delete(path)
            
            return {
                'success': True,
                'message': 'Journal entry deleted successfully'
            }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error deleting journal entry: {str(e)}'
            }
    
    @staticmethod
    def search_journals(user_id: str, keyword: str) -> Dict:
        """Search journal entries by keyword"""
        try:
            path = f'journals/{user_id}'
            data = firebase_service.get(path)
            
            if data:
                matching_journals = []
                keyword_lower = keyword.lower()
                
                for journal_id, journal_data in data.items():
                    content = journal_data.get('content', '').lower()
                    prompt = journal_data.get('prompt', '').lower()
                    
                    if keyword_lower in content or keyword_lower in prompt:
                        journal_entry = JournalEntry.from_dict(journal_id, journal_data)
                        matching_journals.append(journal_entry.to_dict())
                
                matching_journals.sort(key=lambda x: x['created_at'], reverse=True)
                
                return {
                    'success': True,
                    'count': len(matching_journals),
                    'journals': matching_journals
                }
            else:
                return {
                    'success': True,
                    'count': 0,
                    'journals': []
                }
        except Exception as e:
            return {
                'success': False,
                'message': f'Error searching journals: {str(e)}'
            }


journal_service = JournalService()