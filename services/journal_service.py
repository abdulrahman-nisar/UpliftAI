from typing import Dict
from models.journal_entry import JournalEntry
from services.firebase_service import firebase_service

class JournalService:
    
    @staticmethod
    def create_journal_entry(user_id: str, date: str, content: str, 
                            prompt: str = None) -> Dict:
        try:
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
    def get_user_journals(user_id: str, limit: int = None) -> Dict:
        try:
            path = f'journals/{user_id}'
            data = firebase_service.get(path)
            
            if data:
                journal_list = []
                for journal_id, journal_data in data.items():
                    journal_entry = JournalEntry.from_dict(journal_id, journal_data)
                    journal_list.append(journal_entry.to_dict())
                
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
    def delete_journal_entry(user_id: str, journal_id: str) -> Dict:
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

journal_service = JournalService()