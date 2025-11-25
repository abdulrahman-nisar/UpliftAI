import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const auth = getAuth();


const forms = document.querySelector(".forms"),
  pwShowHide = document.querySelectorAll(".eye-icon"),
  links = document.querySelectorAll(".link"),
  loader = document.getElementById("loading");

pwShowHide.forEach(icon => {
  icon.addEventListener("click", () => {
    const pwFields = icon.parentElement.parentElement.querySelectorAll(".password");
    pwFields.forEach(field => {
      if (field.type === "password") {
        field.type = "text";
        icon.classList.replace("bx-hide", "bx-show");
      } else {
        field.type = "password";
        icon.classList.replace("bx-show", "bx-hide");
      }
    });
  });
});

links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    forms.classList.toggle("show-signup");
  });
});


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


async function signupUser() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-confirm").value;

  if (password !== confirm) {
    showToast("Passwords do not match!", "error");
    return;
  }

  showLoader(true);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    showToast("Signup successful! Redirecting...", "success");
    setTimeout(() => {
      window.location.href = "/goals";
    }, 1500);
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    showLoader(false);
  }
}


async function loginUser() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  showLoader(true);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    showToast("Login successful!", "success");
       setTimeout(() => {
      checkUserStatus();
    }, 1500);
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    showLoader(false);
  }
}


async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  showLoader(true);
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    showToast(`Welcome ${user.displayName}`, "success");
    checkUserStatus();
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    showLoader(false);
  }
}


function checkUserStatus() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Authenticated user:", user.email);
      window.location.href = "/today"; 
    } else {
      console.log("No user signed in");
    }
  });
}

window.signupUser = signupUser;
window.loginUser = loginUser;
window.loginWithGoogle = loginWithGoogle;
