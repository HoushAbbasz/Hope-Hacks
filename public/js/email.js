let emailConfig = null;


// fetch EmailJS config from server
async function loadEmailConfig() {
    try {
        const response = await fetch('/emailConfig');
        emailConfig = await response.json();
        
        // check if EmailJS is loaded
        if (typeof emailjs === 'undefined') {
            console.error('EmailJS library not loaded. Please include the EmailJS script in your HTML.');
            return;
        }
        
        // initialize EmailJS with the API key
        emailjs.init(emailConfig.apiKey);
    } catch (error) {
        console.error('Failed to load email config:', error);
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    await loadEmailConfig();
    
    const form = document.getElementById('register-form');
    
    // check if form exists
    if (!form) {
        console.error('Form with id "register-form" not found');
        return;
    }
    
    const nameInput = document.getElementById('reg-name');
    const emailInput = document.getElementById('reg-email');
    const submitButton = form.querySelector('button');
    
    // check if button exists
    if (!submitButton) {
        console.error('Submit button not found');
        return;
    }
    
    form.addEventListener('submit', async function(e) {
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
            // register user in database
            console.log('Sending to /register endpoint...');
            const registerResponse = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, name })
            });
            
            console.log('Response status:', registerResponse.status);
            
            if (!registerResponse.ok) {
                const errorData = await registerResponse.json();
                console.error('Registration failed:', errorData);
                throw new Error(errorData.error || 'Registration failed');
            }
            
            const registerData = await registerResponse.json();
            
            // send confirmation email via EmailJS
            console.log('Sending email via EmailJS...');
            const response = await emailjs.send(
                emailConfig.serviceId,
                emailConfig.templateId,
                templateParams
            );
            
            alert('Thank you for subscribing! Check your inbox.');
            nameInput.value = '';
            emailInput.value = '';
        } catch (error) {
            console.error('✗ Error:', error);
            
            if (error.message.includes('already registered')) {
                alert('This email is already subscribed to our newsletter.');
            } else {
                alert('Failed to complete subscription. Please try again.');
            }
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit';
        }
    });
});