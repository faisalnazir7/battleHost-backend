const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  loginStatus,
  updateUser,
  getTotalUsers,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/getuser", protect, getUser);
router.get("/total", getTotalUsers);
router.get("/loggedin", loginStatus);
router.patch("/updateuser", protect, updateUser);

module.exports = router;
