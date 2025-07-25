const jwt = require('jsonwebtoken');
const User = require('../models/User');

const checkAuth = async (req, res, next) => {

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try{

        // Get token from header
        token = req.header('Authorization')?.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select('-password');

        next();
    } 
    catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Token is not valid' });
    }
    }
    if(!token){
        res.status(401).json({ message: 'No token, authorization denied' });
    }
};

module.exports = {checkAuth};