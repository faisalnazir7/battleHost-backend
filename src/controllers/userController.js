const asyncHandler = require("express-async-handler");
const User  = require("../models/userModel");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
};


// ++++++++++++ Register User +++++++++++++++++++++

const registerUser = asyncHandler(async (req, res) => {
    const {name, email, password, role} = req.body;

    //Registration Validation 
    if ( !name || !email || !password || !role ) {
        res.status(400);
        throw new Error("Please fill in all required fields");
      }
    if (password.length < 6) {
        res.status(400);
        throw new Error("Password must be up to 6 characters");
    }

    //Check if user email already exists
    const userExists = await User.findOne({email})

    if (userExists) {
    res.status(400);
    throw new Error("Email has already been registered");
    }


    //Create new user
    const user = await User.create({ 
        name,
        email,
        password,
        role
    });

    // Generate Token
    const token = generateToken(user._id);

    // Send HTTP-only cookie
    res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 86400), //1 day
        sameSite: "none",
        secure: true,
    });

    if (user) {
        const {_id, name, email, role, photo, phone} = user
        res.status(201).json({
            _id, name, email, role, photo, phone, token
        });
    } else {
        res.status(400);
        throw new error("Invalid user data")    
    }

});

module.exports = {
    registerUser,
}