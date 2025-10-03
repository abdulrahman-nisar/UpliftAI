from flask import Flask, render_template
from backend.services import journal_services

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('frontend/index.html',entries=journal_services.get_all_journal_entires())



if __name__ == "__main__":
    app.run(debug=True)