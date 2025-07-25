const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//new user signup and also check if user already exists
const signup = async (req, res) => {
    const {username, email, password} = req.body;
    try{
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

    //password hashing
    const salt= await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //new user
    const newUser = new User({
        username,
        email,
        password: hashedPassword
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, 
        );

        res.status(201).json({ token, user: { id: newUser._id, username: newUser.username } });
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong' });
    }
};

//user login
const login = async (req, res) => {
    const{ email, password } = req.body;

    // Check if user exists and validate password
    try{
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
    
        // Compare password with hashed password
        const Match = await bcrypt.compare(password, user.password);
        if(!Match) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        //case when password matched and create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
          });

          res.status(200).json({ token, user: { id: user._id, username: user.username } });
        }
    catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

module.exports = {
    signup,
    login
};