import { auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

const toast = document.getElementById('toast');
let toastTimer;

function showMessage(msg) {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// Redirect if already logged in
onAuthStateChanged(auth, user => {
  if (user) window.location.href = 'index.html';
});

// Toggle password visibility
document.getElementById('toggle-password').addEventListener('click', e => {
  const input = document.getElementById('login-password');
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  e.currentTarget.textContent = show ? 'Hide' : 'Show';
});

// Login / Signup form
let isSignup = false;

document.getElementById('signup-link').addEventListener('click', e => {
  e.preventDefault();
  isSignup = !isSignup;
  document.querySelector('.login-submit b').textContent = isSignup ? 'Create account' : 'Continue';
  document.getElementById('signup-link').textContent = isSignup ? 'Log in instead' : 'Create an account';
  showMessage(isSignup ? 'Enter your details to create an account.' : 'Welcome back!');
});

document.getElementById('login-form').addEventListener('submit', async e => {
  e.preventDefault();
  if (!e.currentTarget.reportValidity()) return;

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  try {
    if (isSignup) {
      await createUserWithEmailAndPassword(auth, email, password);
      showMessage('Account created! Welcome to Community.');
    } else {
      await signInWithEmailAndPassword(auth, email, password);
      showMessage('Logged in! Redirecting…');
    }
    setTimeout(() => window.location.href = 'index.html', 1200);
  } catch (err) {
    const messages = {
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Try again.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/invalid-credential': 'Incorrect email or password.'
    };
    showMessage(messages[err.code] || 'Something went wrong. Please try again.');
  }
});

// Google Sign-in
document.querySelector('[data-social-login]').addEventListener('click', async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    showMessage('Signed in with Google! Redirecting…');
    setTimeout(() => window.location.href = 'index.html', 1200);
  } catch (err) {
    if (err.code !== 'auth/popup-closed-by-user') {
      showMessage('Google sign-in failed. Please try again.');
    }
  }
});

// Forgot password
document.getElementById('forgot-password').addEventListener('click', async e => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim();
  if (!email) {
    document.getElementById('login-email').focus();
    showMessage('Enter your email address first.');
    return;
  }
  try {
    await sendPasswordResetEmail(auth, email);
    showMessage('Password reset email sent! Check your inbox.');
  } catch (err) {
    showMessage('Could not send reset email. Check the address and try again.');
  }
});
