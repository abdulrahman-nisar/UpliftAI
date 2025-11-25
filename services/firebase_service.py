import firebase_admin
from firebase_admin import credentials, db
from typing import Optional, Dict, Any
import os


class FirebaseService:
    """Firebase Admin SDK service for server-side operations"""
    
    _instance = None
    _initialized = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(FirebaseService, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not FirebaseService._initialized:
            self.initialize_firebase()
            FirebaseService._initialized = True
    
    def initialize_firebase(self):
        """Initialize Firebase Admin SDK"""
        try:
            # Path to your serviceAccountKey.json
            cred_path = os.path.join(os.path.dirname(__file__), '..', 'serviceAccountKey.json')
            
            if not os.path.exists(cred_path):
                raise FileNotFoundError(f"Service account key not found at {cred_path}")
            
            cred = credentials.Certificate(cred_path)
            
            firebase_admin.initialize_app(cred, {
                'databaseURL': 'https://upliftai-44452-default-rtdb.firebaseio.com/'
            })
            
            print("✅ Firebase Admin SDK initialized successfully")
        except Exception as e:
            print(f"❌ Firebase initialization error: {str(e)}")
            raise
    
    def create(self, path: str, data: Dict[str, Any]) -> str:
        """Create a new record and return the generated key"""
        try:
            ref = db.reference(path)
            new_ref = ref.push(data)
            return new_ref.key
        except Exception as e:
            print(f"Error creating record at {path}: {str(e)}")
            raise
    
    def set(self, path: str, data: Dict[str, Any]) -> None:
        """Set data at a specific path (overwrites existing data)"""
        try:
            ref = db.reference(path)
            ref.set(data)
        except Exception as e:
            print(f"Error setting data at {path}: {str(e)}")
            raise
    
    def get(self, path: str) -> Optional[Dict]:
        """Get data from a specific path"""
        try:
            ref = db.reference(path)
            return ref.get()
        except Exception as e:
            print(f"Error getting data from {path}: {str(e)}")
            return None
    
    def update(self, path: str, data: Dict[str, Any]) -> None:
        """Update existing data at path"""
        try:
            ref = db.reference(path)
            ref.update(data)
        except Exception as e:
            print(f"Error updating data at {path}: {str(e)}")
            raise
    
    def delete(self, path: str) -> None:
        """Delete data at path"""
        try:
            ref = db.reference(path)
            ref.delete()
        except Exception as e:
            print(f"Error deleting data at {path}: {str(e)}")
            raise
    
    def query(self, path: str, order_by: str, equal_to: Any = None, 
              limit_to_first: int = None, limit_to_last: int = None) -> Optional[Dict]:
        """Query data with filters"""
        try:
            ref = db.reference(path)
            query = ref.order_by_child(order_by)
            
            if equal_to is not None:
                query = query.equal_to(equal_to)
            if limit_to_first:
                query = query.limit_to_first(limit_to_first)
            if limit_to_last:
                query = query.limit_to_last(limit_to_last)
            
            return query.get()
        except Exception as e:
            print(f"Error querying data at {path}: {str(e)}")
            return None
    
    def get_all(self, path: str) -> Dict:
        """Get all records at path"""
        try:
            ref = db.reference(path)
            data = ref.get()
            return data if data else {}
        except Exception as e:
            print(f"Error getting all data from {path}: {str(e)}")
            return {}


# Singleton instance
firebase_service = FirebaseService()