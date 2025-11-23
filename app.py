from flask import Flask, render_template
from flask_cors import CORS
from dotenv import load_dotenv
import os
from api.routes import api

app = Flask(__name__)
CORS(app) # Enable CORS for all routes
app.register_blueprint(api) # Register API Blueprint

load_dotenv()  # loads .env variables

@app.route('/', methods=['GET', 'POST'])
def login():
    firebase_api_key = os.getenv("FIREBASE_API_KEY")
    return render_template('index.html', firebase_api_key=firebase_api_key)

@app.route('/goals')
def goals():
    firebase_api_key = os.getenv("FIREBASE_API_KEY")
    return render_template('goals.html', firebase_api_key=firebase_api_key)

@app.route('/dashboard')
def dashboard():
    firebase_api_key = os.getenv("FIREBASE_API_KEY")
    return render_template('dashboard.html', firebase_api_key=firebase_api_key)


if __name__ == "__main__":
    app.run(debug=True)
