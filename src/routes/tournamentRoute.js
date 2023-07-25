const express=require('express');
const router=express.Router();

const protect = require('../middleware/authMiddleware');
const { createTournament } = require('../controllers/tournamentController');

router.post('/createtournament', protect, createTournament);

module.exports=router