require('dotenv').config();
const express = require('express');
const path = require('path');
const connection = require('./database');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); //JSON parsing
// serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));


// ===== AUTH ROUTES =====
// register
app.post('/register', async (req, res) => {
  console.log('/register endpoint hit');
  console.log('Request body:', req.body);
  
  const { email, name } = req.body;
  
  console.log('=== REGISTRATION REQUEST ===');
  console.log('Email:', email);
  console.log('Name:', name);

  try {
    const [result] = await connection.promise().query(
      'INSERT INTO users (email, name) VALUES (?, ?)',
      [email, name || null]
    );
    
    console.log('DATABASE INSERT SUCCESSFUL!');

    res.status(201).json({ message: 'User Registered!' });
  } catch (error) {
    console.error('REGISTRATION ERROR:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
    
    // check if it's a duplicate entry error
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'This email is already registered.' });
    } else {
      res.status(400).json({ error: 'Registration failed: ' + error.message });
    }
  }
});


// ===== PAGE ROUTES =====
// api endpoint to get the google maps api key
app.get('/mapAPI', (req, res) => {
  res.json({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
  });
});

// home page route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/index.html'));
});

// map page route
app.get('/map', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/map.html'));
});

app.get('/kyr', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/kyr.html'));
});

app.get('/newsletter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/newsletter.html'));
});

app.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/auth.html'));
});

app.get('/email', (req, res) => {
 res.sendFile(path.join(__dirname, 'public/pages/email.html'));
});


app.get('/emailConfig', (req, res) => {
 res.json({
   apiKey: process.env.EMAIL_API_KEY,
   serviceId: process.env.EMAIL_SERVICE_ID,
   templateId: process.env.EMAIL_TEMPLATE_ID
 });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Database: ${process.env.DB_NAME}`);
});