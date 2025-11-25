import { auth } from './FirebaseConfig.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import activityViewModel from '../viewmodels/ActivityViewModel.js';
import userViewModel from '../viewmodels/UserViewModel.js';


const sidebar = document.querySelector(".sidebar");
const closeBtn = document.querySelector("#btn-close");
const openBtn = document.querySelector("#btn-open");
const entryModal = document.getElementById("entry-modal");
const activityModal = document.getElementById("activity-modal");
const loadingSpinner = document.getElementById('loading');
const activityList = document.getElementById('activity-list');

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

window.openActivityModal = () => {
    closeNewEntryModal();
    activityModal.style.display = "block";
}

window.closeActivityModal = () => {
    activityModal.style.display = "none";
    document.getElementById('activity-form').reset();
}

window.onclick = (event) => {
    if (event.target == entryModal) {
        closeNewEntryModal();
    }
    if (event.target == activityModal) {
        closeActivityModal();
    }
}


onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            showLoading(true);
            
            const profileResponse = await userViewModel.getUserProfile(user.uid);
            if (profileResponse.success) {
                const initials = getInitials(profileResponse.user.username || 'User');
                const avatarEl = document.getElementById('header-profile-avatar');
                if (avatarEl) avatarEl.textContent = initials;
            }
            
            await loadActivities(user.uid);

        } catch (error) {
            console.error("Error loading data:", error);
            showToast("Failed to load activities", "error");
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

async function loadActivities(userId) {
    try {
        const response = await activityViewModel.getUserActivities(userId);
        if (response.success) {
            renderActivities(response.activities);
            updateStats(response.activities);
        } else {
            showToast(response.error || "Failed to load activities", "error");
        }
    } catch (error) {
        console.error("Error fetching activities:", error);
        showToast("Error fetching activities", "error");
    }
}

function renderActivities(activities) {
    activityList.innerHTML = '';
    
    if (activities.length === 0) {
        activityList.innerHTML = `
            <div class="empty-state">
                <i class='bx bx-run'></i>
                <p>No activities logged yet. Get moving!</p>
            </div>
        `;
        return;
    }

    
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    activities.forEach(activity => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        
        const date = new Date(activity.timestamp).toLocaleDateString(undefined, {
            weekday: 'short', month: 'short', day: 'numeric'
        });
        
        
        let iconClass = 'bx-run';
        if (activity.type === 'Cycling') iconClass = 'bx-cycling';
        if (activity.type === 'Yoga') iconClass = 'bx-body';
        if (activity.type === 'Meditation') iconClass = 'bx-brain';
        if (activity.type === 'Swimming') iconClass = 'bx-water';
        if (activity.type === 'Gym') iconClass = 'bx-dumbbell';

        item.innerHTML = `
            <div class="activity-left">
                <div class="activity-icon">
                    <i class='bx ${iconClass}'></i>
                </div>
                <div class="activity-details">
                    <h4>${activity.type}</h4>
                    <p>${activity.notes || 'No notes'}</p>
                </div>
            </div>
            <div class="activity-right">
                <span class="activity-duration">${activity.duration} min</span>
                <span class="activity-date">${date}</span>
            </div>
        `;
        
        activityList.appendChild(item);
    });
}

function updateStats(activities) {
    const totalCount = activities.length;
    const totalDuration = activities.reduce((sum, act) => sum + parseInt(act.duration || 0), 0);

    document.getElementById('total-activities').textContent = totalCount;
    document.getElementById('total-duration').textContent = `${totalDuration} mins`;
}

window.saveActivityEntry = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const type = document.getElementById('activity-type').value;
    const duration = document.getElementById('activity-duration').value;
    const notes = document.getElementById('activity-notes').value;

    if (!type || !duration) {
        showToast("Please fill in all required fields", "error");
        return;
    }

    const activityData = {
        user_id: user.uid,
        activity_name: type,
        type: type,
        duration: parseInt(duration),
        notes: notes,
        date: new Date().toISOString().split('T')[0]
    };

    try {
        showLoading(true);
        
        const response = await activityViewModel.logActivity(activityData);
        
        if (response.success) {
            showToast("Activity logged successfully!", "success");
            closeActivityModal();
            await loadActivities(user.uid);
        } else {
            showToast(response.error || "Failed to save activity", "error");
        }
    } catch (error) {
        console.error("Error saving activity:", error);
        showToast("Failed to save activity", "error");
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
