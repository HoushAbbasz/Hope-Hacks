require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// api endpoint to get the google maps api key
app.get('/mapAPI', (req, res) => {
  res.json({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
  });
});

// home page route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// map page route
app.get('/map', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/map.html'));
});

app.get('/kyr', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/kyr.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:3000`);
});