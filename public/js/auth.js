// Base API URL
const API_URL = '/';

const registerForm = document.getElementById('register-form');
const regEmail = document.getElementById("reg-email");
const showRegisterBtn = document.getElementById("show-register");


  showRegisterBtn.addEventListener("click", () => {
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
  });

  // Handle Registration
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const res = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        email: regEmail.value
    })
  });

  if (res.ok) {
    alert("Registration successful.");
  } else {
    alert("Registration failed");
  }
});