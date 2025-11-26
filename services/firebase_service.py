import firebase_admin
from firebase_admin import credentials, db
from typing import Optional, Dict, Any
import os

class FirebaseService:
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
        try:
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
        try:
            ref = db.reference(path)
            new_ref = ref.push(data)
            return new_ref.key
        except Exception as e:
            print(f"Error creating record at {path}: {str(e)}")
            raise
    
    def set(self, path: str, data: Dict[str, Any]) -> None:
        try:
            ref = db.reference(path)
            ref.set(data)
        except Exception as e:
            print(f"Error setting data at {path}: {str(e)}")
            raise
    
    def get(self, path: str) -> Optional[Dict]:
        try:
            ref = db.reference(path)
            return ref.get()
        except Exception as e:
            print(f"Error getting data from {path}: {str(e)}")
            return None
    
    def update(self, path: str, data: Dict[str, Any]) -> None:
        try:
            ref = db.reference(path)
            ref.update(data)
        except Exception as e:
            print(f"Error updating data at {path}: {str(e)}")
            raise
    
    def delete(self, path: str) -> None:
        try:
            ref = db.reference(path)
            ref.delete()
        except Exception as e:
            print(f"Error deleting data at {path}: {str(e)}")
            raise

firebase_service = FirebaseService()