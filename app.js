import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD5yhUCxpWaZan1oJWdTVb9oJVO32xYv10",
  authDomain: "smeafact.firebaseapp.com",
  projectId: "smeafact",
  storageBucket: "smeafact.firebasestorage.app",
  messagingSenderId: "770573575881",
  appId: "1:770573575881:web:a67263962a304006cf0f18"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById("loginForm");
const pesanError = document.getElementById("pesanError");

if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                alert("Berhasil login!");
                window.location.href = "dashboard.html"; 
            })
            .catch((error) => {
                pesanError.textContent = "Email atau password salah!";
                console.error(error);
            });
    });
}