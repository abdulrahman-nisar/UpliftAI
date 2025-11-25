from flask import Flask, render_template
from flask_cors import CORS
from dotenv import load_dotenv
import os
from api.routes import api

app = Flask(__name__)
CORS(app) 
app.register_blueprint(api) 

load_dotenv() 

@app.route('/', methods=['GET', 'POST'])
def login():
    firebase_api_key = os.getenv("FIREBASE_API_KEY")
    return render_template('index.html', firebase_api_key=firebase_api_key)

@app.route('/goals')
def goals():
    firebase_api_key = os.getenv("FIREBASE_API_KEY")
    return render_template('goals.html', firebase_api_key=firebase_api_key)

@app.route('/today')
def today():
    firebase_api_key = os.getenv("FIREBASE_API_KEY")
    return render_template('today.html', firebase_api_key=firebase_api_key)

@app.route('/journal')
def journal_page():
    firebase_api_key = os.getenv("FIREBASE_API_KEY")
    return render_template('journal.html', firebase_api_key=firebase_api_key)

@app.route('/activity')
def activity_page():
    firebase_api_key = os.getenv("FIREBASE_API_KEY")
    return render_template('activity.html', firebase_api_key=firebase_api_key)

@app.route('/profile')
def profile_page():
    firebase_api_key = os.getenv("FIREBASE_API_KEY")
    return render_template('profile.html', firebase_api_key=firebase_api_key)


if __name__ == "__main__":
    app.run(debug=True)
