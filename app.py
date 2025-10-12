from flask import Flask, redirect, render_template, request, url_for
from models.JournalEntryModel import JournalEntryModel
from services import journal_services, user_services
from datetime import date


app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        user_id = user_services.authenticate_user(username, password)
        if user_id == -1:
            return "Invalid credentials", 401

        entries = journal_services.get_all_journal_entires(user_id)
        return render_template('index.html', entries=entries, user_id=user_id)

    return render_template('index.html')

    
# @app.route('/<int:user_id>/entries', methods=['GET'])
# def get_all_entries(user_id: int):
#     entries = journal_services.get_all_journal_entires(user_id)
#     return render_template('frontend/index.html', entries=entries, user_id=user_id)


# @app.route('/<int:user_id>/entries/<int:entry_id>', methods=['GET'])
# def get_entry(user_id: int, entry_id: int):
#     entry = journal_services.get_journal_entry(entry_id)
#     return render_template('frontend/edit_entry.html', entry=entry, user_id=user_id)


# @app.route('/<int:user_id>/entries', methods=['POST'])
# def create_entry(user_id: int):
#     data = request.form

#     new_entry = JournalEntry(
#         user_id=user_id,
#         entry_id=data.get('entry_id'),
#         title=data.get('title'),
#         content=data.get('content'),
#         date=date.today()
#     )
    
#     journal_services.create_journal_entry(new_entry)
#     return redirect(url_for('get_all_entries', user_id=user_id))


# @app.route('/<int:user_id>/entries/<int:entry_id>', methods=['POST'])
# def update_entry(user_id: int, entry_id: int):
#     data = request.form

#     entry = JournalEntry(
#         user_id=user_id,
#         entry_id=data.get('entry_id'),
#         title=data.get('title'),
#         content=data.get('content'),
#         date=date.today()
#     )
    
#     journal_services.update_journal_entry(entry)
#     return redirect(url_for('get_all_entries', user_id=user_id))


# @app.route('/<int:user_id>/entries/<int:entry_id>/delete', methods=['POST'])
# def delete_entry(user_id: int, entry_id: int):
#     journal_services.delete_journal_entry(entry_id)
#     return redirect(url_for('get_all_entries', user_id=user_id))

if __name__ == "__main__":
    app.run(debug=True)
