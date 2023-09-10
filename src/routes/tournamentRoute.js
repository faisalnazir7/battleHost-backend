const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  createTournament,
  registerForTournament,
  tournamentDetails,
  getAllTournaments,
  registerUserForTournament,
  updateTournament,
  deleteTournament,
} = require("../controllers/tournamentController");
const {declareResultsController,displayResultsController}=require('../controllers/resultController')
router.post("/createtournament", protect, createTournament);
router.get("/alltournaments", getAllTournaments);
router.get("/:tournamentId", tournamentDetails);
router.post("/registerfortournament", protect, registerUserForTournament);
router.patch("/:tournamentId/updatetournament", protect, updateTournament);
router.delete("/:tournamentId/deletetournament", protect, deleteTournament);
router.post("/:tournamentId/declareresults", protect, declareResultsController);
router.get("/:tournamentId/displayresults", protect, displayResultsController);

module.exports = router;
