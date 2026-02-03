// // Base API URL
// const API_URL = '/';

// const registerForm = document.getElementById('register-form');
// const regEmail = document.getElementById('reg-email');
// const emailError = document.getElementById('email-error');
// const successMessage = document.getElementById('success-message');

// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// registerForm.addEventListener('submit', async (e) => {
//   e.preventDefault();

//   emailError.classList.add('hidden');
//   successMessage.classList.add('hidden');

//   const email = regEmail.value.trim();

//   // Front end Validation
//   if(!email) {
//     showError('Email is required');
//     return;
//   }

//   if (!emailRegex.test(email)) {
//     showError('Please enter a valid email address');
//     return;
//   }

//   // Submit to Server
//   try {
//     const res = await fetch('/register', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email })
//     });

//     if (res.ok) {
//       successMessage.textContent = "You're subscribed!";
//       successMessage.classList.remove('hidden');
//       registerForm.reset();
//     } else {
//     showError('This email is already registered.');
//     }
//   } catch (err) {
//     showError('Something went wrong. Please try again.');
//   };
// });

// function showError(message) {
//   emailError.textContent = message;
//   emailError.classList.remove('hidden');
// }