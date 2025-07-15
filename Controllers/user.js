const User = require('../Modals/user');
const Video = require('../Modals/video'); // Add this if you're showing user videos
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
exports.signUp = async (req, res) => {
  try {
    const { channelName, userName, about, profilePic, password } = req.body;
    const isExist = await User.findOne({ userName });

    if (isExist) {
      return res.status(400).json({ error: "Username already exists. Please try another username" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      channelName,
      userName,
      about,
      profilePic,
      password: hashedPassword
    });

    await user.save();

    res.status(201).json({
      message: 'User registered successfully',
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during registration' });
  }
};

// LOGIN
exports.signIn = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user._id }, 'Its_My_Secret_Key', {
      expiresIn: '1h'
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // use true in production
      maxAge: 3600000 // 1 hour
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
};

// LOGOUT
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'User logged out successfully' });
};

// ✅ GET USER PROFILE BY ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select('channelName userName about profilePic createdAt');
    const videos = await Video.find({ user: id }); // optional: if showing user's videos

    res.status(200).json({
      user,
      videos
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};
