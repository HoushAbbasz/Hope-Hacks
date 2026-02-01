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
  const { email } = req.body;

  try {
    await connection.promise().query('INSERT INTO users (email) VALUES (?)',
      [email,]
    );

    res.status(201).json({ message: 'User Registered!' });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed.' });
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

// know your rights page route
app.get('/kyr', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/kyr.html'));
});

// newsletter page route 
app.get('/newsletter', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/newsletter.html'));
});

// home spanish page route
app.get('/es', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/indexES.html'));
});

// map spanish page route
app.get('/mapes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/mapES.html'));
});

// know your rights spanish page route
app.get('/kyres', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/kyrES.html'));
});

// newsletter spanish page route 
app.get('/newsletteres', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/newsletterES.html'));
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
});