const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const config = require('./config');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const { authenticateUser } = require('./middleware');
const { connectDB, readUsers, signup, login, uploadPhotoUrl, UploadFriend, retrievephotos, updateLocation} = require('./mongo');
require('dotenv').config();

// Create an Express app
const app = express();

connectDB();




// Middleware to parse JSON bodies
app.use(bodyParser.json());
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/pics'); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  },
});
const upload = multer({ storage });
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Define routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

//Location
app.post('/location', authenticateUser, async (req, res) => {
  try {
    const {location} = req.body;
    console.log(location);
    const update = await updateLocation(location, req.user._id);
    res.json({ message: 'Successfully saved location' });
  } catch (err) {
    console.error('Error updating location', err);
    res.status(500).json({message:'Internal server error'});
  }
});

//FRIENDS
app.post('/addfriends', authenticateUser, async (req, res) => {
  try {
    const { username } = req.body;
    const update = await UploadFriend(username, req.user._id);

    res.json({ message: 'Successfully updated friends list' });

  } catch (err) {
    console.error('Error updating friends', err);
    // Ensure that the error is caught and a 500 response is sent
    res.status(500).json({ message: 'Internal server error' });
  }
});

//GET PHOTOS
app.get('/getphotos', authenticateUser, async (req, res) => {
  try {
    const photos = await retrievephotos(req.user._id);
    res.json(photos);
  } catch (error) {
    console.error('Error getting photo URLs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//UPLOAD PHOTOS
app.post('/photos', authenticateUser, async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    const uploadedPhoto = await uploadPhotoUrl(title, description, imageUrl, req.user._id);
    res.json({ message: 'Photo URL uploaded successfully', photo: uploadedPhoto });
  } catch (error) {
    console.error('Error uploading photo URL:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

//LOGIN
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await login(username, password);
    //console.log('hi', user);
    if (user) {
      const token = jwt.sign({id: user._id, username: user.username }, process.env.JWT_SECRET);
      res.json({ message: 'Login successful', token });
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
    //console.log("hi", req.body.username);
    const username = req.body.username;
    const password = req.body.password;
    const newUser = await signup(username, password);
    if (!newUser) {
      res.status(409).json({ message: 'Username already exists' });
    } else {
      const token = jwt.sign({id: newUser._id, username: newUser.username }, process.env.JWT_SECRET);
      res.json({ message: 'Sign-in successful', token });
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

app.post('/pic', upload.single('photo'), (req, res) => {
  // `file.fieldname` refers to the 'name' attribute of the file input
  console.log('Uploaded field name:', req.file.fieldname, req.file.filename);

  res.json({
    message: 'File uploaded successfully',
    filename: req.file.filename,
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
