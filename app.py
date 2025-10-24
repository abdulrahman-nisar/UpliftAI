from flask import Flask, redirect, render_template, request, url_for
from models.JournalEntryModel import JournalEntryModel
from services import journal_services, user_services
from dotenv import load_dotenv
import os

app = Flask(__name__)
load_dotenv()  # loads .env variables

@app.route('/', methods=['GET', 'POST'])
def login():
    firebase_api_key = os.getenv("FIREBASE_API_KEY")
    # if request.method == 'POST':
    #     username = request.form.get('username')
    #     password = request.form.get('password')

    #     user_id = user_services.authenticate_user(username, password)
    #     if user_id == -1:
    #         return "Invalid credentials", 401

    #     entries = journal_services.get_all_journal_entires(user_id)
    #     return render_template('index.html', entries=entries, user_id=user_id)

    return render_template('index.html', firebase_api_key=firebase_api_key)


if __name__ == "__main__":
    app.run(debug=True)
