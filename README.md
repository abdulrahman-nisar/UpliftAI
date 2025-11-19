# UpliftAI - RAG-Based Mental Wellness Journal 🌟

A comprehensive daily routine journal application aimed at psychological improvement for users aged 12-30. Built with Flask backend, Firebase for authentication and database, and vanilla JavaScript frontend with AI-powered recommendations.

## 📋 Features

### Core Features
- **User Authentication** - Firebase Auth with email/password and Google Sign-in
- **Personalized Onboarding** - Custom profile creation with psychological goals
- **Daily Mood Tracking** - Track mood, energy, focus, stress, and sleep quality
- **Journal Entries** - Multiple entry types (morning/evening reflections, gratitude, stress logs)
- **Goal Management** - Create and track psychological wellness goals
- **Activity Tracking** - Log and track mental wellness activities
- **Daily Routines** - Create custom routines with activity combinations
- **AI Recommendations** - Personalized suggestions based on mood, goals, and patterns
- **Progress Analytics** - View progress metrics, streaks, and insights

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Setup Environment
Copy `.env.example` to `.env` and add your Firebase credentials and secret key.

### 3. Initialize & Run
```bash
python app.py
```
Visit `http://localhost:5000`

### 4. First Use
- Signup/Login via Firebase (currently demo redirect uses a mock profile on dashboard).
- Dashboard auto seeds base activities, tips, and affirmation corpus.

## 🧠 Data Model Overview
`User(id, firebase_uid, email, age, gender, goals)`
`MoodLog(id, user_id, date, mood, energy, focus, stress_level, sleep_quality, notes)`
`JournalEntry(id, user_id, entry_type, content, sentiment, created_at)`
`Activity(id, name, category, description)`
`Routine(id, user_id, name, is_active, created_at)` + `RoutineItem(routine_id, activity_id, order_index, recommended_duration)`
`Tip(id, text, category, tags)`
`Affirmation(id, text, tags)`
`PromptTemplate(id, template, category)`

## 🔌 API Blueprint (`/api`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/profile          | Create/update user profile |
| GET    | /api/profile?email=   | Retrieve profile by email |
| POST   | /api/moodlogs         | Create mood log |
| GET    | /api/moodlogs?user_id=| List mood logs (limit param) |
| POST   | /api/journal          | Create journal entry |
| GET    | /api/journal?user_id= | List journal entries (entry_type optional) |
| POST   | /api/routines         | Create routine (+ items) |
| GET    | /api/routines?user_id=| List routines + items |
| GET    | /api/rag/prompt?user_id= | Generate contextual journal prompt |
| GET    | /api/rag/suggestions?query=stress | Retrieve tips/affirmations via TF-IDF |
| GET    | /api/activities       | List activities |

## 🤖 RAG Flow (Simplified)
1. Corpus seeds (tips, affirmations, prompt templates).
2. TF-IDF vectorizer fitted in-memory.
3. Retrieval: query similarity over corpus.
4. Generation: combines random template with latest mood context.

## 🗂️ Frontend MVVM
- `static/js/index.js` handles auth UI.
- `static/js/dashboard.js` contains lightweight ViewModels (MoodViewModel, JournalViewModel, RAGViewModel).

## 🔐 Security & Next Steps
- Integrate real Firebase user identity (replace demo profile logic).
- Add authentication middleware for protected endpoints.
- Persist sentiment analysis field using an NLP model.
- Expand RAG to use embedding model (Sentence Transformers) for semantic retrieval.

## 🧪 Development Tips
Run with auto-reload:
```bash
python app.py
```

SQLite file `upliftai.db` created automatically in project root.

## 📈 Roadmap Ideas
- Streak tracking & charts.
- Advanced mood analytics.
- Personalized routine optimization.
- Mobile-friendly micro-interactions.


## 📖 Full Documentation

See complete setup instructions, API documentation, and architecture details in the project wiki.

## 🏗️ Tech Stack

- **Backend**: Flask, Python
- **Database**: Firebase Realtime Database
- **Auth**: Firebase Authentication
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Architecture**: MVC with ViewModels

## 👨‍💻 Author

**Abdul Rahman Nisar** - [@abdulrahman-nisar](https://github.com/abdulrahman-nisar)