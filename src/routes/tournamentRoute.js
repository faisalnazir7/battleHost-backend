const express=require('express');
const router=express.Router();

const protect = require('../middleware/authMiddleware');
const { createTournament, registerForTournament, tournamentDetails,getAllTournaments,registerUserForTournament, updateTournament } = require('../controllers/tournamentController');

router.post('/createtournament', protect, createTournament);
router.get('/alltournaments', getAllTournaments);
router.get('/:tournamentId', tournamentDetails);
router.post('/registerfortournament', protect, registerUserForTournament);
router.patch('/:tournamentId/updatetournament',protect, updateTournament);

module.exports=router