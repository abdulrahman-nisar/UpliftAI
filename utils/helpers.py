"""
Helper utilities
"""
from datetime import datetime, timedelta
from typing import List, Dict


def get_current_date() -> str:
    """Get current date in YYYY-MM-DD format"""
    return datetime.now().strftime('%Y-%m-%d')


def get_current_timestamp() -> str:
    """Get current timestamp in ISO format"""
    return datetime.utcnow().isoformat()


def get_date_range(days: int) -> tuple:
    """Get date range for last N days"""
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    return start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')


def format_response(success: bool, message: str = None, data: Dict = None) -> Dict:
    """Format API response"""
    response = {'success': success}
    
    if message:
        response['message'] = message
    
    if data:
        response.update(data)
    
    return response


def calculate_streak(dates: List[str]) -> int:
    """Calculate consecutive days streak"""
    if not dates:
        return 0
    
    # Sort dates
    sorted_dates = sorted(dates, reverse=True)
    
    streak = 1
    for i in range(len(sorted_dates) - 1):
        current = datetime.strptime(sorted_dates[i], '%Y-%m-%d')
        previous = datetime.strptime(sorted_dates[i + 1], '%Y-%m-%d')
        
        diff = (current - previous).days
        
        if diff == 1:
            streak += 1
        else:
            break
    
    return streak


def sanitize_input(text: str) -> str:
    """Sanitize user input"""
    if not text:
        return ""
    
    # Remove leading/trailing whitespace
    text = text.strip()
    
    # Basic XSS prevention (you can enhance this)
    dangerous_chars = ['<', '>', '"', "'", '&']
    for char in dangerous_chars:
        text = text.replace(char, '')
    
    return text


def paginate_list(items: List, page: int = 1, per_page: int = 10) -> Dict:
    """Paginate a list of items"""
    total = len(items)
    start = (page - 1) * per_page
    end = start + per_page
    
    return {
        'items': items[start:end],
        'total': total,
        'page': page,
        'per_page': per_page,
        'total_pages': (total + per_page - 1) // per_page
    }