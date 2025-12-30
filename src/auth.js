import { auth } from "./firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged // Firebase listener for authentication state
} from "firebase/auth";

// UI elements
const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

const formTitle = document.getElementById("formTitle");
const goSignup = document.getElementById("goSignup");
const errorBox = document.getElementById("errorBox");
const resetBtn = document.getElementById("resetBtn");

// --- UI Switch ---
loginTab.onclick = () => {
  errorBox.textContent = "";
  loginTab.classList.add("active");
  signupTab.classList.remove("active");

  loginForm.style.display = "block";
  signupForm.style.display = "none";

  formTitle.textContent = "Login Form";
};

signupTab.onclick = () => {
  errorBox.textContent = "";
  signupTab.classList.add("active");
  loginTab.classList.remove("active");

  loginForm.style.display = "none";
  signupForm.style.display = "block";

  formTitle.textContent = "Signup Form";
};

goSignup.onclick = (e) => {
  e.preventDefault();
  signupTab.click();
};

// --- LOGIN ---
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorBox.textContent = "";

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "/"; // redirect after login
  } catch (err) {
    errorBox.textContent = err.message;
  }
});

// --- SIGNUP ---
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  errorBox.textContent = "";

  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("signupConfirm").value;

  if (password !== confirm) {
    errorBox.textContent = "Passwords do not match.";
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    window.location.href = "/";
  } catch (err) {
    errorBox.textContent = err.message;
  }
});

// --- Password Reset ---
resetBtn.onclick = async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;

  if (!email) {
    errorBox.textContent = "Enter your email first.";
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    errorBox.style.color = "green";
    errorBox.textContent = "Password reset sent!";
    setTimeout(() => (errorBox.style.color = "red"), 2000);
  } catch (err) {
    errorBox.textContent = err.message;
  }
};

// --- Check Login Status on Page Load ---
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is logged in, redirect to home page or dashboard
    window.location.href = "/library";  // Adjust the redirect URL to your app's main page
  } else {
    // User is not logged in, stay on the login/signup page
    console.log("User is not logged in");
  }
});
