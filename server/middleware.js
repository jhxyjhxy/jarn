const jwt = require('jsonwebtoken');
const { User } = require('./mongo');

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log('to', token);
    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    //console.log();
    //console.log(User);

    const user = await User.findById(decoded.id);


    if (!user) {
      return res.status(401).json({ message: 'Invalid authentication token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error authenticating user:', token, error,);
    res.status(401).json({ message: 'Invalid authentication token' });
  }
};

module.exports = {
  authenticateUser,
};