const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const { generateChallenge } = require('./gemini');
require('dotenv').config();

// Define the User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
});

const locationSchema = new mongoose.Schema({
    username: String,
    location: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      }
});

// Define the Photo schema
const photoSchema = new mongoose.Schema({
    title: String,
    description: String,
    imageUrl: String,
    location: String,
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
  
  

const challengeSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    }, 
    time: {
        type: Date,
        required: true
    },
    title: 
    {
        type: String,
        required: true
    }, 
    description:{
        type: String,
        required: true
    }
});

  // Create the Photo model
  const Photo = mongoose.model('Photo', photoSchema);

  const Location = mongoose.model('Location', locationSchema);

  const updateLocation = async (location, userId) => {
    try { 
        let username = await User.findById(userId);
        let existingLocation = await Location.findOne({ username });

        if (existingLocation) {
          // If a location record exists, update the location
          existingLocation.location = location;
          await existingLocation.save();
        } else {
          // If no location record exists, create a new one
          const newLocation = new Location({
            username,
            location,
            userId
          });
          await newLocation.save();
        }
    } catch (error) {
        console.error('Error uploading Location:', error);
        throw error;
    }
  }

  const Challenges = mongoose.model('Challenge', challengeSchema);
  
  const uploadPhotoUrl = async (title, description, imageUrl, userId) => {
    try {
      const userLocation = await getUserLocation(userId);

    if (!userLocation) {
      throw new Error('User location not found');
    }
      const newPhoto = new Photo({
        title,
        description,
        imageUrl,
        userLocation,
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

const updateChallenge = async (location, time, title, description) => {
  const update = new Challenges({
    location,
    time,
    title,
    description
  });

    try {
      return await update.save();
    } catch (err) {
        return console.log(err);
    }
  }

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
    const photos = await Photo.find().sort({ uploadedAt: -1 });
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
      console.log('User not found:');
    }
    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    console.log(isPasswordCorrect);
    if (!isPasswordCorrect) {
      console.log('Incorrect Password:');
    }
    return existingUser;
  };

const getCurrentChallenge = async (location) => {
  // Find out the most recent time a challenge was released
  const mostRecentChallenge = await Challenges.findOne()
    .sort({ time: -1 })
    .exec();
  const mostRecentTime = mostRecentChallenge ? mostRecentChallenge.time : new Date();

  // Find out the most challenge for current location
  const mostRecentLocalChallenge = await Challenges.findOne({ location })
    .sort({ time: -1 })
    .exec();

  if (!mostRecentLocalChallenge || mostRecentLocalChallenge.time < mostRecentTime) {
    // generate a new challenge for this location
    return makePendingChallenge(location, mostRecentTime);
  } else if (mostRecentLocalChallenge.title === 'pending') {
    // retry popoulating event
    populatePendingChallenge(mostRecentLocalChallenge);
  } else {
    // return most most recent, update to date challenge
    return mostRecentLocalChallenge;
  }
}

const getUserLocation = async (userId) => {
  const location = await Location.findOne({ userId })
  if (location) {
    console.log('found location', location)
    return location.location;
  } else {
    console.log('User has no saved location, returning default')
    return 'Los Angeles, United States'
    // throw new Error(`No user with id ${id}`);
  }
};

const broadcastNewChallenges = async () => {
  const time = new Date();

  const locations = await Location.distinct('location');

  console.log(locations)

  locations.forEach((location, index) => {
    setTimeout(() => {
      makePendingChallenge(location, time);
    }, index * 2000);
  });
}

// calls the generation of a new challenge, returns pending one in the mean time
const makePendingChallenge = async (location, time) => {
  const pendingChallenge = await updateChallenge(location, time, 'pending', 'pending');

  populatePendingChallenge(pendingChallenge);

  return pendingChallenge;
}

// schedule populating of a pending challenge
const populatePendingChallenge = async (pendingChallenge) => {
  try {
    const { location, time, _id } = pendingChallenge;
    const previousChallenges = await Challenges.find({ location });

    const text = await generateChallenge(location, previousChallenges);
    const jsonText = text.replace(/```/g, '').replace(/json/g, '');
    console.log('gemini said', jsonText);
    const { title, description } = JSON.parse(jsonText);

    console.log(`updating pending challenge ${_id}, ${location} to ${title} -- ${description}`)

    const updatedChallenge = await Challenges.findByIdAndUpdate(
      _id,
      { '$set': { title, description } },
      { new: true }
    );

    console.log(updatedChallenge);
  } catch (error) {
    console.error(`failed to populate pending challenge ${pendingChallenge}`)
  }

};

const getUserById = (id) => {
  return User.findById(id);
}


module.exports = {
  connectDB,
  readUsers,
  readPhotos,
  signup,
  login,
  uploadPhotoUrl,
  User,
  Photo,
  updateLocation,
  getCurrentChallenge,
  getUserLocation,
  broadcastNewChallenges,
  getUserById
};