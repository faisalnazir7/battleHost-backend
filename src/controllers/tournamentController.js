const asyncHandler = require("express-async-handler");
const Tournament = require('../models/tournamentModel');
const User  = require("../models/userModel");


// ++++++++++++++++ Function to handle creating a new tournament ++++++++++

const createTournament = asyncHandler(async (req, res) => {

      const { name, description, startDateTime, endDateTime, rules, prizes } = req.body;

        const organizerId = req.user._id; // Assuming user ID is available in the request (e.g., after authentication)
  
      // Create a new tournament using the Tournament model
      const newTournament = new Tournament({
        name,
        description,
        organizerId,
        startDateTime, // YYYY-MM-ddTHH:mm:ss
        endDateTime,
        rules,
        prizes,
      });
  
      // Save the new tournament to the database
      const savedTournament = await newTournament.save();

      if (newTournament) {
        res.status(201).json({ message: 'Tournament created successfully', tournament: savedTournament });
    } else {
        res.status(500);
        throw new error("Internal server error")    
    }
  });

module.exports = {
  createTournament,
};
