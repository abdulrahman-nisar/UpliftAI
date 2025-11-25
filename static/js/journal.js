import { auth } from './FirebaseConfig.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import journalViewModel from '../viewmodels/JournalViewModel.js';
import moodViewModel from '../viewmodels/MoodViewModel.js';
import userViewModel from '../viewmodels/UserViewModel.js';
import geminiService from './GeminiService.js';

// DOM Elements
const sidebar = document.querySelector(".sidebar");
const closeBtn = document.querySelector("#btn-close");
const openBtn = document.querySelector("#btn-open");
const entryModal = document.getElementById("entry-modal");
const journalEditorModal = document.getElementById("journal-editor-modal");
const loadingSpinner = document.getElementById('loading');
const journalGrid = document.getElementById('journal-grid');
const searchInput = document.getElementById('search-input');

let allEntries = [];

// Sidebar Logic
closeBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    sidebar.classList.toggle("collapsed");
    menuBtnChange();
});

openBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    sidebar.classList.toggle("collapsed");
    menuBtnChange();
});

function menuBtnChange() {
    if (sidebar.classList.contains("open")) {
        closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
    } else {
        closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
    }
}

// Modal Logic
window.openNewEntryModal = () => {
    entryModal.style.display = "block";
}

window.closeNewEntryModal = () => {
    entryModal.style.display = "none";
}

window.openJournalEditor = () => {
    closeNewEntryModal();
    journalEditorModal.style.display = "block";
}

window.closeJournalEditor = () => {
    journalEditorModal.style.display = "none";
    document.getElementById('journal-form').reset();
}

const moodModal = document.getElementById("mood-modal");

window.openMoodModal = () => {
    closeNewEntryModal();
    moodModal.style.display = "block";
}

window.closeMoodModal = () => {
    moodModal.style.display = "none";
    document.getElementById('mood-form').reset();
}

window.saveMoodEntry = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const mood = document.getElementById('mood-select').value;
    const energy = document.getElementById('energy-select').value;

    try {
        showLoading(true);
        const response = await moodViewModel.logMood(user.uid, mood, energy);
        
        if (response.success) {
            showToast("Mood logged successfully!", "success");
            closeMoodModal();
            // Optionally refresh suggestions based on new mood
            loadSuggestion(user.uid);
        } else {
            showToast("Failed to log mood", "error");
        }
    } catch (error) {
        console.error("Error logging mood:", error);
        showToast("Error logging mood", "error");
    } finally {
        showLoading(false);
    }
};

// View Entry Logic
const viewModal = document.getElementById('view-entry-modal');
const confirmModal = document.getElementById('confirm-modal');
let currentEntryId = null;
let entryToDeleteId = null;

window.closeViewModal = () => {
    viewModal.style.display = "none";
    currentEntryId = null;
}

window.viewEntry = (entry) => {
    currentEntryId = entry.journal_id; // Ensure backend returns journal_id
    document.getElementById('view-title').textContent = entry.prompt || 'Untitled';
    document.getElementById('view-content').textContent = entry.content;
    
    const date = new Date(entry.date).toLocaleDateString(undefined, {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    document.getElementById('view-date').textContent = date;
    
    viewModal.style.display = "block";
}

// Confirmation Modal Logic
window.openConfirmModal = (id = null) => {
    entryToDeleteId = id || currentEntryId;
    if (!entryToDeleteId) return;
    confirmModal.style.display = "block";
}

window.closeConfirmModal = () => {
    confirmModal.style.display = "none";
    entryToDeleteId = null;
}

// Setup Delete Button Listener
document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
    if (entryToDeleteId) {
        await performDelete(entryToDeleteId);
        closeConfirmModal();
    }
});

async function performDelete(journalId) {
    const user = auth.currentUser;
    if (!user) return;

    try {
        showLoading(true);
        const response = await journalViewModel.deleteJournalEntry(user.uid, journalId);
        
        if (response.success) {
            showToast("Entry deleted successfully", "success");
            
            // If we deleted the currently viewed entry, close the view modal
            if (currentEntryId === journalId) {
                closeViewModal();
            }
            
            await loadEntries(user.uid);
        } else {
            showToast("Failed to delete entry", "error");
        }
    } catch (error) {
        console.error("Error deleting entry:", error);
        showToast("Error deleting entry", "error");
    } finally {
        showLoading(false);
    }
}

// Legacy wrapper for grid view delete icon
window.deleteEntry = (journalId) => {
    openConfirmModal(journalId);
};

window.deleteCurrentEntry = () => {
    openConfirmModal(currentEntryId);
};

window.onclick = (event) => {
    if (event.target == entryModal) {
        closeNewEntryModal();
    }
    if (event.target == journalEditorModal) {
        closeJournalEditor();
    }
    if (event.target == viewModal) {
        closeViewModal();
    }
    if (event.target == confirmModal) {
        closeConfirmModal();
    }
    if (event.target == moodModal) {
        closeMoodModal();
    }
}

// Auth & Data Loading
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            showLoading(true);
            // const token = await user.getIdToken();
            
            // Load User Profile for Avatar
            const profileResponse = await userViewModel.getUserProfile(user.uid);
            if (profileResponse.success) {
                const initials = getInitials(profileResponse.user.username || 'User');
                const avatarEl = document.getElementById('header-profile-avatar');
                if (avatarEl) avatarEl.textContent = initials;
            }

            // Load Journal Entries
            await loadEntries(user.uid);

            // Load AI Suggestion
            loadSuggestion(user.uid);

            // Check URL params
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('new') === 'true') {
                openJournalEditor();
            }

        } catch (error) {
            console.error("Error loading data:", error);
            showToast("Failed to load journal entries", "error");
        } finally {
            showLoading(false);
        }
    } else {
        window.location.href = "/";
    }
});

function getInitials(name) {
    if (!name) return 'US';
    const parts = name.split(' ').filter(part => part.length > 0);
    if (parts.length === 0) return 'US';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

async function loadEntries(userId) {
    try {
        const response = await journalViewModel.getUserJournals(userId);
        if (response.success) {
            allEntries = response.journals;
            renderEntries(allEntries);
        } else {
            console.error("Error fetching entries:", response.error);
            showToast("Failed to load entries", "error");
        }
    } catch (error) {
        console.error("Error fetching entries:", error);
        throw error;
    }
}

function renderEntries(entries) {
    journalGrid.innerHTML = '';
    
    if (entries.length === 0) {
        journalGrid.innerHTML = `
            <div class="empty-state">
                <i class='bx bx-book-open'></i>
                <p>No entries yet. Start writing your story!</p>
            </div>
        `;
        return;
    }

    entries.forEach(entry => {
        const card = document.createElement('div');
        card.className = 'journal-card';
        const date = new Date(entry.date).toLocaleDateString(undefined, {
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
        });
        
        card.innerHTML = `
            <div class="card-header">
                <span>${date}</span>
                <div class="card-actions btn-icon delete-btn-corner">
                    <i class='bx bx-trash' title="Delete" onclick="event.stopPropagation(); window.deleteEntry('${entry.journal_id}')"></i>
                </div>
            </div>
            <div class="card-title">${entry.prompt || 'Untitled'}</div>
            <div class="card-preview">${entry.content}</div>
        `;
        
        // Add click handler to view details
        card.onclick = () => window.viewEntry(entry);
        
        journalGrid.appendChild(card);
    });
}

// Search Logic
searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allEntries.filter(entry => 
        (entry.prompt && entry.prompt.toLowerCase().includes(term)) || 
        entry.content.toLowerCase().includes(term)
    );
    renderEntries(filtered);
});

// Save Entry
window.saveJournalEntry = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const title = document.getElementById('journal-title').value;
    const content = document.getElementById('journal-content').value;

    try {
        showLoading(true);
        
        // We use the 'prompt' field to store the title as requested
        await journalViewModel.createJournalEntry(user.uid, content, title);
        
        showToast("Entry saved successfully!", "success");
        closeJournalEditor();
        await loadEntries(user.uid); // Reload list
    } catch (error) {
        console.error("Error saving entry:", error);
        showToast("Failed to save entry", "error");
    } finally {
        showLoading(false);
    }
};

// AI Suggestion Logic
let currentPrompt = "";

async function loadSuggestion(userId) {
    const suggestionContent = document.getElementById('suggestion-content');
    const suggestionActions = document.getElementById('suggestion-actions');
    
    if (!suggestionContent) return;

    // Show loading state
    suggestionContent.innerHTML = `
        <div class="loading-suggestion">
            <div class="typing-indicator">
                <span></span><span></span><span></span>
            </div>
            <p>Gemini is crafting a thought for you...</p>
        </div>
    `;
    suggestionActions.style.display = 'none';

    try {
        // 1. Get User Context (Mood & Recent Journals)
        // We already have allEntries from loadEntries
        const recentJournals = allEntries.slice(0, 3).map(e => e.content);
        
        // Get latest mood
        let userMood = "neutral";
        const moodResponse = await moodViewModel.getUserMoods(userId, 1);
        if (moodResponse.success && moodResponse.moods.length > 0) {
            userMood = moodResponse.moods[0].mood;
        }

        // 2. Generate Prompt via Gemini
        const promptResponse = await geminiService.generateJournalPrompt(userMood, [], [], recentJournals);
        currentPrompt = promptResponse.prompt;

        // 3. Display Result
        suggestionContent.innerHTML = `<p>"${currentPrompt}"</p>`;
        suggestionActions.style.display = 'flex';

        // 4. Load Affirmation & Quote
        loadAffirmation(userMood);
        loadQuote(userMood);

    } catch (error) {
        console.error("Error generating suggestion:", error);
        suggestionContent.innerHTML = `<p>Could not generate a suggestion right now. How are you feeling?</p>`;
    }
}

async function loadAffirmation(mood) {
    const el = document.getElementById('affirmation-content');
    if (!el) return;
    try {
        const text = await geminiService.generateDailyAffirmation(mood);
        el.innerHTML = `<p>"${text}"</p>`;
    } catch (e) {
        console.error("Error loading affirmation:", e);
        el.innerHTML = `<p>I am enough.</p>`;
    }
}

async function loadQuote(mood) {
    const el = document.getElementById('quote-content');
    if (!el) return;
    try {
        const text = await geminiService.generateQuote(mood);
        el.innerHTML = `<p>${text}</p>`;
    } catch (e) {
        el.innerHTML = `<p>Keep going.</p>`;
    }
}

window.refreshSuggestion = () => {
    const user = auth.currentUser;
    if (user) {
        loadSuggestion(user.uid);
    }
};

window.usePrompt = () => {
    openJournalEditor();
    const titleInput = document.getElementById('journal-title');
    if (titleInput) {
        titleInput.value = currentPrompt;
        // document.getElementById('journal-content').focus();
    }
};

// Helper Functions
function showLoading(show) {
    if (show) loadingSpinner.classList.remove('hidden');
    else loadingSpinner.classList.add('hidden');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toast.style.background = type === 'error' ? '#ff6b6b' : '#6C63FF';
    toast.style.color = '#fff';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '8px';
    toast.style.marginBottom = '10px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    toast.style.animation = 'slideIn 0.3s ease';

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
