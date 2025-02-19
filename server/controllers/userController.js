const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

function generateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
}
module.exports.register = async (req, res) => {
    try{

        const{ name, email, password } = req.body;
        if(!name || !email || !password){
            return res.status(400).json({msg: "All fields are required"});
        }
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ msg: "Please use a valid email address" });
        }
        const userExists = await userModel.findOne({email});
        if(userExists){
            return res.status(400).json({msg: "User already exists"});
        }

        if(password.length < 6){
            return res.status(400).json({msg: "Password must be at least 6 characters long"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({
            name,
            email,
            password: hashedPassword
        });
        await user.save();

         const token = generateToken(user);
         return res.status(201).json({msg: "User created successfully", token});

    }catch(err){
        console.error("Server Error:", err);
        return res.status(500).json({msg: `Internal server error: ${err.message}`});
    }
};

module.exports.login = async(req, res) =>{
    try{
        const { email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({msg: "All fields are required"});
        }
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({msg: "Invalid credentials", login: false});
        };
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({msg: "Invalid credentials", login: false});
        }
        const token = generateToken(user);
        return res.status(200).json({msg: "Login successful", token});

    }catch(err){
        return res.status(500).json({msg: `Internal server error: ${err.message}`});
    }
}
