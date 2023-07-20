const express=require('express');
const { registerUser, loginUser, logoutUser, getUser, loginStatus } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const router=express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/getuser',protect, getUser);
router.get("/loggedin", loginStatus);

module.exports=router