const express=require('express');
const router=express.Router();

const protect = require('../middleware/authMiddleware');
const { createTournament, registerForTournament } = require('../controllers/tournamentController');

router.post('/createtournament', protect, createTournament);
router.post('/registerfortournament', protect, registerForTournament);

module.exports=router