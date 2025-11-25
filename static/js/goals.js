import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import userViewModel from '../viewmodels/UserViewModel.js';

const auth = getAuth();
let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        console.log("User authenticated:", user.email);
    } else {
        window.location.href = "/";
    }
});


window.toggleGoal = function(element) {
    element.classList.toggle('selected');
}

const loader = document.getElementById("loading");
function showLoader(show) {
    loader.classList.toggle("hidden", !show);
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconClass = 'bx-info-circle';
    if (type === 'success') iconClass = 'bx-check-circle';
    if (type === 'error') iconClass = 'bx-x-circle';

    toast.innerHTML = `
        <i class='bx ${iconClass} toast-icon'></i>
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);
    toast.offsetHeight; 
    
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, 3000);
}


window.saveProfile = async function() {
    if (!currentUser) {
        showToast("User not authenticated", "error");
        return;
    }

    const username = document.getElementById('username').value;
    const age = document.getElementById('age').value;
    

    const selectedGoals = [];
    document.querySelectorAll('.goal-item.selected').forEach(item => {
        selectedGoals.push(item.getAttribute('data-value'));
    });

    if (selectedGoals.length === 0) {
        showToast("Please select at least one goal", "error");
        return;
    }

    showLoader(true);

    try {
        const result = await userViewModel.createUserProfile(
            currentUser.uid,
            currentUser.email,
            username,
            parseInt(age),
            selectedGoals
        );

        if (result.success) {
            showToast("Profile created successfully!", "success");
            setTimeout(() => {
                window.location.href = "/today"; 
            }, 1500);
        } else {
            showToast(result.error || "Failed to create profile", "error");
        }
    } catch (error) {
        console.error("Error saving profile:", error);
        showToast("An unexpected error occurred", "error");
    } finally {
        showLoader(false);
    }
}
