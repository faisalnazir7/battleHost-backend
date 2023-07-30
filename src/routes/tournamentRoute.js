const express=require('express');
const router=express.Router();

const protect = require('../middleware/authMiddleware');
const { createTournament, registerForTournament, tournamentDetails,getAllTournaments,registerUserForTournament } = require('../controllers/tournamentController');

router.post('/createtournament', protect, createTournament);
router.get('/alltournaments', getAllTournaments);
router.get('/:tournamentId', tournamentDetails);
router.post('/registerfortournament', protect, registerUserForTournament);

module.exports=router