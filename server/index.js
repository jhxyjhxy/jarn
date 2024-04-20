const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const config = require('./config');
const jwt = require('jsonwebtoken');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const { authenticateUser } = require('./middleware');
const { connectDB, readUsers, signup, login} = require('./mongo');
require('dotenv').config();

// Create an Express app
const app = express();

connectDB();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Define routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});


//LOGIN
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    //console.log(username);
    //console.log(password);
    const user = await login(username, password);
    console.log('hi', user);
    if (user) {
      
      //const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.json({ message: 'Login successful'});
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//SIGNUP + Make an account
app.post('/signup', async (req, res) => {
  try {
    console.log("hi", req.body.username);
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    //const { username, password, email } = req.body;
    const newUser = await signup(username, password, email);
    if (newUser) {
      res.json({ message: 'Sign-in successful', user: newUser });
    } else {
      res.status(409).json({ message: 'Username already exists' });
    }
  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


//get all users
app.get('/users', async (req, res) => {
  try {
    // Read users from the database
    console.log("please");
    const users = await readUsers();
    
    // Send the users as the response
    res.json(users);
  } catch (error) {
    console.error('Error reading users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// example generates generic story
app.get('/gemini', async (req, res) => {
  const prompt = "Write a story about a magic backpack."
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  res.send(text);
});

// example generates story about param topic
app.get('/gemini/:topic', async (req, res) => {
  const prompt = `Write a story about ${req.params.topic}`
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  res.send(text);
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
