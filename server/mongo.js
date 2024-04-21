const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
require('dotenv').config();

// Define the User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
});

// Define the Photo schema
const photoSchema = new mongoose.Schema({
    title: String,
    description: String,
    imageUrl: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  // Create the Photo model
  const Photo = mongoose.model('Photo', photoSchema);
  
  const uploadPhotoUrl = async (title, description, imageUrl, userId) => {
    try {
      const newPhoto = new Photo({
        title,
        description,
        imageUrl,
        uploadedBy: userId,
        uploadedAt: new Date(),
      });
      await newPhoto.save();
      return newPhoto;
    } catch (error) {
      console.error('Error uploading photo URL:', error);
      throw error;
    }
  };
  

// Create the User model
const User = mongoose.model('User', userSchema);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Function to read users from the database
const readUsers = async () => {
  try {
    // Find all users
    const users = await User.find();
    return users;
  } catch (error) {
    console.error('Error reading users:', error);
    throw error;
  }
};

const readPhotos = async () => {
  try {
    // Find all photos
    const photos = await Photo.find();
    return photos;
  } catch (error) {
    console.error('Error reading photos:', error);
    // throw error;
  }
}

const signup = async (username, password, email) => {
    //console.log("test", req.body);
    //const {username, email, password} = req.body;
    
    let existingUser;

    console.log(username);
    console.log(password);
    console.log(email);
    try {
        existingUser = await User.findOne({username});
    } catch (err) {
        return console.log(err);
    } if (existingUser) {
        console.log('User already exists:', error);
        throw error;
    }
     //hash password for extra security
     const hashedPassword = bcrypt.hashSync(password);

    const user = new User({
        username,
        email,
        password: hashedPassword
    });

   
    try {
        await user.save();
    } catch (err) {
        return console.log(err);
    } 
};

const login = async (username, password) => {
    let existingUser;
    try {
      existingUser = await User.findOne({ username });
    } catch (err) {
      return console.log(err);
    }
    if (!existingUser) {
      console.log('User not found:', error);
      throw error;
    }
    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    console.log(isPasswordCorrect);
    if (!isPasswordCorrect) {
      console.log('Incorrect Password:', error);
      throw error;
    }
    return existingUser;
  };



module.exports = {
  connectDB,
  readUsers,
  readPhotos,
  signup,
  login,
  uploadPhotoUrl,
  User,
  Photo
};