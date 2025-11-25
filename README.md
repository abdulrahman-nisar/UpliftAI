# UpliftAI - RAG-Based Mental Wellness Journal 🌟

UpliftAI is an intelligent mental wellness companion designed to help users track their emotional well-being, set psychological goals, and engage in meaningful self-reflection. 

Unlike standard journaling apps, UpliftAI utilizes **Retrieval-Augmented Generation (RAG)** powered by **Google's Gemini AI**. It analyzes your current mood and energy levels, retrieves relevant psychological tips and quotes from a curated knowledge base, and generates personalized, empathetic journaling prompts to guide your writing.

## 🚀 Key Features

### 🧠 AI-Powered Journaling (RAG)
- **Context-Aware Prompts:** The system combines your current mood with relevant wellness content to generate unique writing prompts using Gemini AI.
- **Empathetic Companion:** Acts as a supportive guide rather than just a text editor.

### 📊 Mood & Energy Tracking
- **Daily Check-ins:** Log your mood (Happy, Anxious, Sad, etc.) and energy levels.
- **Visual Analytics:** Track emotional trends over time to identify patterns.

### 🎯 Goal Management
- **Psychological Goals:** Set and track specific wellness objectives (e.g., "Reduce Anxiety", "Improve Sleep").
- **Progress Tracking:** Monitor your journey towards better mental health.

### 🧘 Wellness Activities
- **Curated Routines:** Access a library of mental health activities (meditation, breathing exercises, gratitude logging).
- **Custom Routines:** Build your own daily wellness plan.

### 🎨 Modern UI/UX
- **Glassmorphism Design:** A calming, aesthetic interface designed to reduce visual stress.
- **Responsive Layout:** Works seamlessly across desktop and tablet sizes.
- **Dark Mode:** Built with a dark-themed aesthetic for comfortable night-time usage.

## 🛠️ Tech Stack

- **Backend:** Python (Flask)
- **Database & Auth:** Google Firebase (Firestore & Authentication)
- **AI Engine:** Google Gemini API (Generative Language Model)
- **Frontend:** HTML5, CSS3 (Custom Glassmorphism), Vanilla JavaScript
- **Architecture:** MVC (Model-View-Controller) with Service-Repository pattern

## 📂 Project Structure

```
UpliftAI/
├── api/                 # API Routes and Blueprints
├── models/              # Data Models (User, JournalEntry, MoodEntry)
├── services/            # Business Logic (Gemini, Firebase, Content)
├── static/
│   ├── css/             # Custom Stylesheets (Glassmorphism)
│   ├── js/              # Frontend Logic & ViewModels
│   └── images/          # Assets
├── templates/           # HTML Templates (Jinja2)
├── utils/               # Helper functions and validators
├── viewmodels/          # Frontend Data Binding Logic
├── app.py               # Application Entry Point
└── requirements.txt     # Python Dependencies
```

## ⚡ Quick Start Guide

### Prerequisites
- Python 3.8+
- A Firebase Project (with Firestore & Auth enabled)
- A Google Cloud Project (with Gemini API enabled)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/UpliftAI.git
   cd UpliftAI
   ```

2. **Create Virtual Environment**
   ```bash
   python -m venv .venv
   # Windows
   .venv\Scripts\activate
   # Mac/Linux
   source .venv/bin/activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   FLASK_APP=app.py
   FLASK_ENV=development
   FIREBASE_API_KEY=your_firebase_api_key
   # Add other Firebase config keys as needed by your setup
   ```
   *Note: Ensure your `static/js/config.js` or environment variables are set up with your Gemini API Key.*

5. **Run the Application**
   ```bash
   python app.py
   ```
   Access the app at `http://localhost:5000`

## 🔒 Security & Privacy
- **Authentication:** Secure login/signup flows handled via Firebase Auth.
- **Data Privacy:** User journals and mood logs are stored securely in Firestore with user-level isolation.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.
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