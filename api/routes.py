from flask import Blueprint, request, jsonify
from services.user_service import user_service
from services.mood_service import mood_service
from services.journal_service import journal_service
from services.activity_service import activity_service
from services.content_service import content_service
from utils.validators import validate_email, validate_required_fields
from datetime import datetime

api = Blueprint('api', __name__, url_prefix='/api')

# User Routes Start
@api.route('/users/profile', methods=['POST'])
def create_user_profile():
    try:
        data = request.get_json()
        
        required = ['user_id', 'email', 'username', 'age']
        if not validate_required_fields(data, required):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
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
    try:
        result = user_service.get_user_profile(user_id)
        status_code = 200 if result['success'] else 404
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500
#User Routes End

#Mood Routes Start
@api.route('/moods', methods=['POST'])
def create_mood_entry():
    try:
        data = request.get_json()
        
        required = ['user_id', 'mood', 'energy']
        if not validate_required_fields(data, required):
            return jsonify({
                'success': False,
                'message': 'Missing required fields'
            }), 400
        
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
    try:
        limit = request.args.get('limit', type=int)
        result = mood_service.get_user_moods(user_id, limit)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500
# Mood Routes End

# Journal Routes Start
@api.route('/journals', methods=['POST'])
def create_journal_entry():
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
    try:
        limit = request.args.get('limit', type=int)
        result = journal_service.get_user_journals(user_id, limit)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500


@api.route('/journals/<user_id>/<journal_id>', methods=['DELETE'])
def delete_journal_entry(user_id, journal_id):
    try:
        result = journal_service.delete_journal_entry(user_id, journal_id)
        status_code = 200 if result['success'] else 400
        return jsonify(result), status_code
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500
# Journal Routes End

# Activity Routes Start
@api.route('/activities/log', methods=['POST'])
def log_user_activity():
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
    try:
        result = activity_service.get_user_activities(user_id)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500
# Activity Routes End

# Content Routes Start
@api.route('/content/retrieve', methods=['GET'])
def retrieve_relevant_content():
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
    
@api.route('/content/tips', methods=['GET'])
def get_wellness_tips():
    try:
        mood = request.args.get('mood')
        result = content_service.get_wellness_tips(mood)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500
    
@api.route('/content/quote', methods=['GET'])
def get_motivational_quote():
    try:
        category = request.args.get('category')
        result = content_service.get_motivational_quote(category)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Server error: {str(e)}'
        }), 500
# Content Routes End