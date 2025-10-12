import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const auth = getAuth();

// Toggle Password Visibility
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

//  Show/Hide Loader
function showLoader(show) {
  loader.classList.toggle("hidden", !show);
}

//  Signup Function
async function signupUser() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-confirm").value;

  if (password !== confirm) {
    alert("Passwords do not match!");
    return;
  }

  showLoader(true);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    alert("Signup successful!");
    //checkUserStatus();
  } catch (error) {
    alert(error.message);
  } finally {
    showLoader(false);
  }
}

//  Login Function
async function loginUser() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  showLoader(true);
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
    //checkUserStatus();
  } catch (error) {
    alert(error.message);
  } finally {
    showLoader(false);
  }
}

//  Google Login Function
async function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  showLoader(true);
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    alert(`Welcome ${user.displayName}`);
   // checkUserStatus();
  } catch (error) {
    alert(error.message);
  } finally {
    showLoader(false);
  }
}

// Check User Authentication Status
function checkUserStatus() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // user is logged in — redirect or render new page
      console.log("Authenticated user:", user.email);
      window.location.href = "/dashboard"; // example redirect
    } else {
      console.log("No user signed in");
    }
  });
}

window.signupUser = signupUser;
window.loginUser = loginUser;
window.loginWithGoogle = loginWithGoogle;
