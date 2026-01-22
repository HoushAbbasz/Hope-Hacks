require('dotenv').config();
const express = require('express');

const path = require('path');

// create express app instance
const app = express();
// set port
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

// sends API key to browser if you go to (example: localhost:3000/api/config)
app.get('/api/config', (req, res) => {
  res.json({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
  });
});

// serves apiTest.html at the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'apiTest.html'));
});

// start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});