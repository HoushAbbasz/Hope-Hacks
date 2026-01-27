require('dotenv').config();
const express = require('express');
const path = require('path');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const connection = require('./database');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); //JSON parsing
// serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// // middleware
// function authenticate(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(401).json({ error: "No token provided" });

//   const token = authHeader.split(" ")[1];

//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(403).json({ error: "Invalid token" });
//     req.userId = decoded.id;
//     next();
//   });
// }

// // ===== AUTH ROUTES =====
// // register
// app.post('/register', async (req, res) => {
//   const { username, email, password } = req.body;

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     await connection.promise().query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
//       [username, email, hashedPassword,]
//     );

//     res.status(201).json({ message: 'User created!' });
//   } catch (error) {
//     res.status(400).json({ error: 'Registration failed.' });
//   }
// });

// // login
// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   const [rows] = await connection.promise().query(
//     'SELECT * FROM users WHERE email = ?',
//     [email]
//   );

//   if (rows.length === 0){
//     return res.status(404).json({ error: 'User not found!' });
//   }

//   const user = rows[0];
//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) {
//     return res.status(401).json({ error: 'Invalid credentials!' });
//   }

//   // Create JWT containing user ID
//   const token = jwt.sign(
//     { id: user.id }, 
//     process.env.JWT_SECRET, 
//     { expiresIn: '1h',}
//   );

//     res.json({ token });
// });

// ===== PAGE ROUTES =====
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