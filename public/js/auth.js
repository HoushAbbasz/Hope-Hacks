// Base API URL
const API_URL = '/';

const registerForm = document.getElementById('register-form');
//const loginForm = document.getElementById('login-form');
//const regUsername = document.getElementById("reg-username");
const regEmail = document.getElementById("reg-email");
//const regPassword = document.getElementById("reg-password");

//const loginEmail = document.getElementById("login-email");
//const loginPassword = document.getElementById("login-password");

//const showLoginBtn = document.getElementById("show-login");
const showRegisterBtn = document.getElementById("show-register");

// if (sessionStorage.getItem("token")) {
//   window.location.href = '/library';
//}

  // showLoginBtn.addEventListener("click", () => {
  //   loginForm.classList.remove("hidden");
  //   registerForm.classList.add("hidden");
  // });

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


// Handle Login
// loginForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const res = await fetch("/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//             email: loginEmail.value,
//             password: loginPassword.value
//         })
//     });
//     if (!res.ok) {
//       alert("Login failed.");
//       return;
//     }
//     const data = await res.json();
//     // Store token
//     sessionStorage.setItem("token", data.token);

//     // Redirect to dashboard
//     window.location.href = '/library';
// });