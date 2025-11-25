"""
Flask API Routes for RAG Wellness Journal
"""
from flask import Blueprint, request, jsonify
from services.user_service import user_service
from services.mood_service import mood_service
from services.journal_service import journal_service
from services.activity_service import activity_service
from services.content_service import content_service
from utils.validators import validate_email, validate_required_fields
from datetime import datetime

# Create Blueprint
api = Blueprint('api', __name__, url_prefix='/api')


# ============================================
# USER ROUTES
# ============================================

@api.route('/users/profile', methods=['POST'])
def create_user_profile():
    """Create user profile after Firebase Auth signup"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required = ['user_id', 'email', 'username', 'age']
        if not validate_required_fields(data, required):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
        # Validate email
        if not validate_email(data['email']):
            return jsonify({
                'success': False,
                'message': 'Invalid email format'
            }), 400
        
        result = user_service.create_user_profile(
            user_id=data['user_id'],
            email=data['email'],
            username=data['username'],
            age=data['age'],
            goals=data.get('goals', [])
        )
        
        status_code = 201 if result['success'] else 400
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/users/<user_id>', methods=['GET'])
def get_user_profile(user_id):
    """Get user profile"""
    try:
        result = user_service.get_user_profile(user_id)
        status_code = 200 if result['success'] else 404
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/users/<user_id>', methods=['PUT'])
def update_user_profile(user_id):
    """Update user profile"""
    try:
        data = request.get_json()
        result = user_service.update_user_profile(user_id, data)
        status_code = 200 if result['success'] else 400
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/users/<user_id>/goals', methods=['GET'])
def get_user_goals(user_id):
    """Get user goals"""
    try:
        result = user_service.get_user_goals(user_id)
        status_code = 200 if result['success'] else 404
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/users/<user_id>/goals', methods=['PUT'])
def update_user_goals(user_id):
    """Update user goals"""
    try:
        data = request.get_json()
        goals = data.get('goals', [])
        
        result = user_service.update_user_goals(user_id, goals)
        status_code = 200 if result['success'] else 400
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


# ============================================
# MOOD ROUTES
# ============================================

@api.route('/moods', methods=['POST'])
def create_mood_entry():
    """Create a new mood entry"""
    try:
        data = request.get_json()
        
        required = ['user_id', 'mood', 'energy']
        if not validate_required_fields(data, required):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
        # Use current date if not provided
        date = data.get('date', datetime.now().strftime('%Y-%m-%d'))
        
        result = mood_service.create_mood_entry(
            user_id=data['user_id'],
            date=date,
            mood=data['mood'],
            energy=data['energy'],
            notes=data.get('notes')
        )
        
        status_code = 201 if result['success'] else 400
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/moods/<user_id>', methods=['GET'])
def get_user_moods(user_id):
    """Get all mood entries for a user"""
    try:
        limit = request.args.get('limit', type=int)
        result = mood_service.get_user_moods(user_id, limit)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/moods/<user_id>/<entry_id>', methods=['GET'])
def get_mood_entry(user_id, entry_id):
    """Get a specific mood entry"""
    try:
        result = mood_service.get_mood_entry(user_id, entry_id)
        status_code = 200 if result['success'] else 404
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/moods/<user_id>/<entry_id>', methods=['PUT'])
def update_mood_entry(user_id, entry_id):
    """Update a mood entry"""
    try:
        data = request.get_json()
        result = mood_service.update_mood_entry(user_id, entry_id, data)
        status_code = 200 if result['success'] else 400
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/moods/<user_id>/<entry_id>', methods=['DELETE'])
def delete_mood_entry(user_id, entry_id):
    """Delete a mood entry"""
    try:
        result = mood_service.delete_mood_entry(user_id, entry_id)
        status_code = 200 if result['success'] else 400
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/moods/<user_id>/stats', methods=['GET'])
def get_mood_statistics(user_id):
    """Get mood statistics"""
    try:
        days = request.args.get('days', default=7, type=int)
        result = mood_service.get_mood_statistics(user_id, days)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/moods/<user_id>/range', methods=['GET'])
def get_moods_by_date_range(user_id):
    """Get moods within date range"""
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        if not start_date or not end_date:
            return jsonify({
                'success': False,
                'message': 'start_date and end_date are required'
            }), 400
        
        result = mood_service.get_moods_by_date_range(user_id, start_date, end_date)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


# ============================================
# JOURNAL ROUTES
# ============================================

@api.route('/journals', methods=['POST'])
def create_journal_entry():
    """Create a new journal entry"""
    try:
        data = request.get_json()
        
        required = ['user_id', 'content']
        if not validate_required_fields(data, required):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
        date = data.get('date', datetime.now().strftime('%Y-%m-%d'))
        
        result = journal_service.create_journal_entry(
            user_id=data['user_id'],
            date=date,
            content=data['content'],
            prompt=data.get('prompt')
        )
        
        status_code = 201 if result['success'] else 400
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/journals/<user_id>', methods=['GET'])
def get_user_journals(user_id):
    """Get all journal entries for a user"""
    try:
        limit = request.args.get('limit', type=int)
        result = journal_service.get_user_journals(user_id, limit)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/journals/<user_id>/<journal_id>', methods=['GET'])
def get_journal_entry(user_id, journal_id):
    """Get a specific journal entry"""
    try:
        result = journal_service.get_journal_entry(user_id, journal_id)
        status_code = 200 if result['success'] else 404
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/journals/<user_id>/<journal_id>', methods=['PUT'])
def update_journal_entry(user_id, journal_id):
    """Update a journal entry"""
    try:
        data = request.get_json()
        result = journal_service.update_journal_entry(user_id, journal_id, data)
        status_code = 200 if result['success'] else 400
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/journals/<user_id>/<journal_id>', methods=['DELETE'])
def delete_journal_entry(user_id, journal_id):
    """Delete a journal entry"""
    try:
        result = journal_service.delete_journal_entry(user_id, journal_id)
        status_code = 200 if result['success'] else 400
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/journals/<user_id>/search', methods=['GET'])
def search_journals(user_id):
    """Search journal entries by keyword"""
    try:
        keyword = request.args.get('keyword', '')
        
        if not keyword:
            return jsonify({
                'success': False,
                'message': 'keyword parameter is required'
            }), 400
        
        result = journal_service.search_journals(user_id, keyword)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/journals/<user_id>/range', methods=['GET'])
def get_journals_by_date_range(user_id):
    """Get journals within date range"""
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        if not start_date or not end_date:
            return jsonify({
                'success': False,
                'message': 'start_date and end_date are required'
            }), 400
        
        result = journal_service.get_journals_by_date_range(user_id, start_date, end_date)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


# ============================================
# ACTIVITY ROUTES
# ============================================

@api.route('/activities', methods=['POST'])
def create_activity():
    """Create a new activity"""
    try:
        data = request.get_json()
        
        required = ['name', 'type', 'duration']
        if not validate_required_fields(data, required):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
        result = activity_service.create_activity(
            name=data['name'],
            type=data['type'],
            duration=data['duration'],
            description=data.get('description')
        )
        
        status_code = 201 if result['success'] else 400
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/activities', methods=['GET'])
def get_all_activities():
    """Get all activities"""
    try:
        result = activity_service.get_all_activities()
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/activities/<activity_id>', methods=['GET'])
def get_activity(activity_id):
    """Get a specific activity"""
    try:
        result = activity_service.get_activity(activity_id)
        status_code = 200 if result['success'] else 404
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/activities/<activity_id>', methods=['PUT'])
def update_activity(activity_id):
    """Update an activity"""
    try:
        data = request.get_json()
        result = activity_service.update_activity(activity_id, data)
        status_code = 200 if result['success'] else 400
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/activities/<activity_id>', methods=['DELETE'])
def delete_activity(activity_id):
    """Delete an activity"""
    try:
        result = activity_service.delete_activity(activity_id)
        status_code = 200 if result['success'] else 400
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/activities/type/<activity_type>', methods=['GET'])
def get_activities_by_type(activity_type):
    """Get activities by type"""
    try:
        result = activity_service.get_activities_by_type(activity_type)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/activities/recommendations', methods=['GET'])
def get_recommended_activities():
    """Get recommended activities based on mood and goals"""
    try:
        mood = request.args.get('mood')
        goals = request.args.getlist('goals')
        
        result = activity_service.get_recommended_activities(mood, goals)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/activities/log', methods=['POST'])
def log_user_activity():
    """Log a user activity"""
    try:
        data = request.get_json()
        
        required = ['user_id', 'activity_name', 'duration', 'date']
        if not validate_required_fields(data, required):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
            
        user_id = data.pop('user_id')
        result = activity_service.log_user_activity(user_id, data)
        
        status_code = 201 if result['success'] else 400
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/activities/user/<user_id>', methods=['GET'])
def get_user_activities(user_id):
    """Get all activities for a user"""
    try:
        result = activity_service.get_user_activities(user_id)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


# ============================================
# CONTENT ROUTES (RAG)
# ============================================

@api.route('/content', methods=['POST'])
def create_content():
    """Create new psychological content"""
    try:
        data = request.get_json()
        
        required = ['text', 'type', 'category']
        if not validate_required_fields(data, required):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
        result = content_service.create_content(
            text=data['text'],
            type=data['type'],
            category=data['category'],
            tags=data.get('tags', [])
        )
        
        status_code = 201 if result['success'] else 400
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/content', methods=['GET'])
def get_all_content():
    """Get all content"""
    try:
        result = content_service.get_all_content()
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/content/<content_id>', methods=['GET'])
def get_content(content_id):
    """Get specific content"""
    try:
        result = content_service.get_content(content_id)
        status_code = 200 if result['success'] else 404
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/content/category/<category>', methods=['GET'])
def get_content_by_category(category):
    """Get content by category"""
    try:
        result = content_service.get_content_by_category(category)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/content/type/<content_type>', methods=['GET'])
def get_content_by_type(content_type):
    """Get content by type"""
    try:
        result = content_service.get_content_by_type(content_type)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/content/retrieve', methods=['GET'])
def retrieve_relevant_content():
    """RAG: Retrieve relevant content based on user mood and goals"""
    try:
        mood = request.args.get('mood')
        goals = request.args.getlist('goals')
        
        result = content_service.retrieve_relevant_content(mood, goals)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/content/prompt', methods=['GET'])
def generate_journal_prompt():
    """Generate personalized journal prompt"""
    try:
        mood = request.args.get('mood')
        goals = request.args.getlist('goals')
        
        result = content_service.generate_journal_prompt(mood, goals)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/content/quote', methods=['GET'])
def get_motivational_quote():
    """Get a random motivational quote"""
    try:
        category = request.args.get('category')
        result = content_service.get_motivational_quote(category)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/content/tips', methods=['GET'])
def get_wellness_tips():
    """Get wellness tips"""
    try:
        mood = request.args.get('mood')
        result = content_service.get_wellness_tips(mood)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


# ============================================
# HEALTH CHECK
# ============================================

@api.route('/health', methods=['GET'])
def health_check():
    """API health check"""
    return jsonify({
        'success': True,
        'message': 'API is running',
        'timestamp': datetime.utcnow().isoformat()
    }), 200