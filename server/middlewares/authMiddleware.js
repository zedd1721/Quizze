const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

module.exports.protect = async (req, res, next) => {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({msg: "No Token, Authorization Denied"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if(!user){
            return res.status(404).json({msg: "No User found with this id"});
        }
        req.user = user;
        next();

    }catch(err){
        console.error("Server Error:", err);
        return res.status(500).json({msg: `Internal server error: ${err.message}`});
    }
}