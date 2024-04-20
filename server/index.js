const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const config = require('./config');
require('dotenv').config();

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Define routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// example generates generic story
app.get('/gemini', async (req, res) => {
  const reqBody = {
    "contents": [{
      "parts": [{
        "text": "Write a story about a magic backpack."
      }]
    }]
  };
  axios.post(`${config.geminiUrl}?key=${process.env.GOOGLE_API_KEY}`, reqBody)
    .then(geminiRes => {
      res.send(geminiRes.data)
    });
});

// example generates story about param topic
app.get('/gemini/:topic', async (req, res) => {
  const reqBody = {
    "contents": [{
      "parts": [{
        "text": `Write a story about ${req.params.topic}.`
      }]
    }]
  };
  axios.post(`${config.geminiUrl}?key=${process.env.GOOGLE_API_KEY}`, reqBody)
    .then(geminiRes => {
      res.send(geminiRes.data)
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
