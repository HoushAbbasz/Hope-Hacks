let emailConfig = null;


// fetch EmailJS config from server
async function loadEmailConfig() {
   try {
       const response = await fetch('/emailConfig');
       emailConfig = await response.json();
       // initialize EmailJS with the API key
       emailjs.init(emailConfig.apiKey);
   } catch (error) {
       console.error('Failed to load email config:', error);
   }
}


// load config when page loads
loadEmailConfig();


const nameInput = document.getElementById('name');
const emailInput = document.getElementById('input');
const submitButton = document.getElementById('submit');


submitButton.addEventListener('click', async function(e) {
   e.preventDefault();
   const name = nameInput.value.trim();
   const email = emailInput.value.trim();
  
   // basic email validation
   if (!email || !email.includes('@')) {
       alert('Please enter a valid email address');
       return;
   }


   if (!emailConfig) {
       alert('Email service not ready. Please try again.');
       return;
   }


       const update = '📢 New civic engagement tools launched in your area';
       const update2 = '🗳️ Upcoming town hall meeting on January 15th at 7 PM';
       const update3 = '📚 Free workshops on understanding local government this weekend';
       const updateSpanish = '📢 Nuevas herramientas de participación cívica lanzadas en tu área';
       const updateSpanish2 = '🗳️ Próxima reunión municipal el 15 de enero a las 7 PM';
       const updateSpanish3 = '📚 Talleres gratuitos sobre gobierno local este fin de semana';
  
   // template parameters with test updates
   const templateParams = {
       name: name || '',
       toEmail: email,
       update: update,
       update2: update2,
       update3: update3,
       updateSpanish: updateSpanish,
       updateSpanish2: updateSpanish2,
       updateSpanish3: updateSpanish3
   };
  
   submitButton.disabled = true;
   submitButton.textContent = 'Sending...';
  
   try {
       const response = await emailjs.send(
           emailConfig.serviceId,
           emailConfig.templateId,
           templateParams
       );
      
       console.log('Email sent successfully:', response);
       alert('Email sent successfully! Check your inbox.');
       nameInput.value = '';
       emailInput.value = '';
   } catch (error) {
       console.error('Failed to send email:', error);
       alert('Failed to send email. Please try again.');
   } finally {
       submitButton.disabled = false;
       submitButton.textContent = 'Submit';
   }
});

