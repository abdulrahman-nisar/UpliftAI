import { auth } from './FirebaseConfig.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import userViewModel from '../viewmodels/UserViewModel.js';
import moodViewModel from '../viewmodels/MoodViewModel.js';
import journalViewModel from '../viewmodels/JournalViewModel.js';
import contentViewModel from '../viewmodels/ContentViewModel.js';


const sidebar = document.querySelector(".sidebar");
const closeBtn = document.querySelector("#btn-close");
const openBtn = document.querySelector("#btn-open");
const entryModal = document.getElementById("entry-modal");
const moodModal = document.getElementById("mood-modal");
const loadingSpinner = document.getElementById('loading');


const currentMonthEl = document.getElementById('current-month');
const calendarGridEl = document.getElementById('calendar-grid');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');

let currentDate = new Date();


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


window.openNewEntryModal = () => {
    entryModal.style.display = "block";
}

window.closeNewEntryModal = () => {
    entryModal.style.display = "none";
}

window.openMoodModal = () => {
    closeNewEntryModal();
    moodModal.style.display = "block";
}

window.closeMoodModal = () => {
    moodModal.style.display = "none";
}

window.onclick = (event) => {
    if (event.target == entryModal) {
        closeNewEntryModal();
    }
    if (event.target == moodModal) {
        closeMoodModal();
    }
}


onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            showLoading(true);
            
            
            setGreeting();

            
            const response = await userViewModel.getUserProfile(user.uid);
            if (response.success) {
                const userData = response.user;
                setGreeting(userData.username || 'Friend');
                
                
                const initials = getInitials(userData.username || 'User');
                const avatarEl = document.getElementById('header-profile-avatar');
                if (avatarEl) avatarEl.textContent = initials;
            }
            
            await loadStats(user.uid);     
            loadDailyContent();
            renderCalendar();

        } catch (error) {
            console.error("Error loading data:", error);
            showToast("Failed to load user data", "error");
        } finally {
            showLoading(false);
        }
    } else {
        window.location.href = "/";
    }
});

function setGreeting(username = null) {
    const hour = new Date().getHours();
    let greetingText = "Good Morning";
    if (hour >= 12 && hour < 17) greetingText = "Good Afternoon";
    else if (hour >= 17) greetingText = "Good Evening";
    
    if (username) {
        document.getElementById('greeting').textContent = `${greetingText}, ${username}!`;
    } else {
        document.getElementById('greeting').textContent = `${greetingText}!`;
    }
}

function getInitials(name) {
    if (!name) return 'US';
    const parts = name.split(' ').filter(part => part.length > 0);
    if (parts.length === 0) return 'US';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

async function loadStats(userId) {
    try {

        const journalResponse = await journalViewModel.getUserJournals(userId);
        if (journalResponse.success) {
            const journals = journalResponse.journals || [];
            document.getElementById('total-entries').textContent = journals.length;
            
            const streak = calculateStreak(journals);
            document.getElementById('streak-count').textContent = `${streak} Days`;
        }
    } catch (error) {
        console.error("Error loading stats:", error);
    }
}

function calculateStreak(journals) {
    if (!journals || journals.length === 0) return 0;

    const dates = journals.map(j => new Date(j.date).setHours(0,0,0,0))
                          .sort((a, b) => a - b);
    
    const uniqueDates = [...new Set(dates)];

    if (uniqueDates.length === 0) return 0;

    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 0; i < uniqueDates.length - 1; i++) {
        const current = uniqueDates[i];
        const next = uniqueDates[i+1];
        
        const diffTime = Math.abs(next - current);
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays === 1) {
            currentStreak++;
        } else {
            maxStreak = Math.max(maxStreak, currentStreak);
            currentStreak = 1;
        }
    }
    
    return Math.max(maxStreak, currentStreak);
}

async function loadDailyContent() {
    try {
        const tipsResponse = await contentViewModel.getWellnessTips();
        if (tipsResponse.success && tipsResponse.tips.length > 0) {
            const randomTip = tipsResponse.tips[Math.floor(Math.random() * tipsResponse.tips.length)];
            document.getElementById('wellness-tip').textContent = randomTip.text;
        }

        const quoteResponse = await contentViewModel.getMotivationalQuote();
        if (quoteResponse.success && quoteResponse.quote) {
            const quote = quoteResponse.quote;
            document.getElementById('daily-quote').textContent = `"${quote.text}"`;
            document.getElementById('quote-author').textContent = `- ${quote.author || 'Unknown'}`;
        }
    } catch (error) {
        console.error("Error loading daily content:", error);
    }
}


function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    currentMonthEl.textContent = `${months[month]} ${year}`;
    calendarGridEl.innerHTML = "";

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    days.forEach(day => {
        const dayHeader = document.createElement("div");
        dayHeader.classList.add("calendar-day-header");
        dayHeader.textContent = day;
        calendarGridEl.appendChild(dayHeader);
    });


    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("calendar-day", "empty");
        calendarGridEl.appendChild(emptyCell);
    }

    
    const today = new Date();
    for (let i = 1; i <= lastDate; i++) {
        const dayCell = document.createElement("div");
        dayCell.classList.add("calendar-day");
        dayCell.textContent = i;

        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayCell.classList.add("today");
        }

        calendarGridEl.appendChild(dayCell);
    }
}

prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});


window.quickLogMood = async (mood) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
        showLoading(true);
        await moodViewModel.createMoodEntry(user.uid, mood, "Medium", "Quick check-in from Today page");
        showToast(`Mood logged: ${mood}`, "success");
    } catch (error) {
        console.error("Error logging mood:", error);
        showToast("Failed to log mood", "error");
    } finally {
        showLoading(false);
    }
};

window.saveMoodEntry = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const mood = document.getElementById('mood-select').value;
    const energy = document.getElementById('energy-select').value;

    try {
        showLoading(true);
        await moodViewModel.createMoodEntry(user.uid, mood, energy, "Logged from Today page");
        showToast("Mood saved successfully!", "success");
        closeMoodModal();
    } catch (error) {
        console.error("Error saving mood:", error);
        showToast("Failed to save mood", "error");
    } finally {
        showLoading(false);
    }
};

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
