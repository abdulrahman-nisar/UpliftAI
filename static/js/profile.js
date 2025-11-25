import { auth } from './FirebaseConfig.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import userViewModel from '../viewmodels/UserViewModel.js';


// DOM Elements
const sidebar = document.querySelector(".sidebar");
const closeBtn = document.querySelector("#btn-close");
const openBtn = document.querySelector("#btn-open");
const entryModal = document.getElementById("entry-modal");
const loadingSpinner = document.getElementById('loading');

// Profile Elements
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const inputName = document.getElementById('input-name');
const inputEmail = document.getElementById('input-email');
const goalsList = document.getElementById('goals-list');

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

window.onclick = (event) => {
    if (event.target == entryModal) {
        closeNewEntryModal();
    }
}

// Auth & Data Loading
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            showLoading(true);
            // const token = await user.getIdToken(); // Not used for ID
            
            // Load User Profile
            const userData = await userViewModel.getUserProfile(user.uid);
            if (userData.success) {
                renderProfile(userData.user);
            } else {
                console.error("Failed to load profile:", userData.error);
                showToast("Failed to load profile", "error");
            }

        } catch (error) {
            console.error("Error loading data:", error);
            showToast("Failed to load profile", "error");
        } finally {
            showLoading(false);
        }
    } else {
        window.location.href = "/";
    }
});

function renderProfile(data) {
    const name = data.username || 'User';
    profileName.textContent = name;
    profileEmail.textContent = data.email || '';
    
    inputName.value = name;
    inputEmail.value = data.email || '';

    // Set Initials
    const initials = getInitials(name);
    document.getElementById('main-profile-avatar').textContent = initials;
    document.getElementById('header-profile-avatar').textContent = initials;

    // Render Goals
    goalsList.innerHTML = '';
    if (data.goals && data.goals.length > 0) {
        data.goals.forEach(goal => {
            const li = document.createElement('li');
            li.textContent = goal;
            goalsList.appendChild(li);
        });
    } else {
        goalsList.innerHTML = '<li>No goals set yet.</li>';
    }
}

function getInitials(name) {
    if (!name) return 'US';
    const parts = name.split(' ').filter(part => part.length > 0);
    if (parts.length === 0) return 'US';
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Logout
window.logout = () => {
    signOut(auth).then(() => {
        window.location.href = "/";
    }).catch((error) => {
        console.error("Error signing out:", error);
        showToast("Error signing out", "error");
    });
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
