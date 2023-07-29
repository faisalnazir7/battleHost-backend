const asyncHandler = require("express-async-handler");
const Tournament = require('../models/tournamentModel');
const RegisterTournament = require('../models/registerTournamentModel');
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

//+++++++++ function to register for tournament+++++++++++++++++++

const registerForTournament = asyncHandler(async (userIdOrTeamMembers, tournamentId, registrationType, teamName = null) => {
    let registrationData = {
      user: userIdOrTeamMembers, // from params or req.user._id
      tournament: tournamentId, // form params or req.tournament._id
      registrationType,
    };

    if (registrationType === 'team') {
      if (!teamName || !Array.isArray(userIdOrTeamMembers)) {
        throw new error('For team registration, provide a team name and an array of team members (user IDs).');
      }

      registrationData = {
        ...registrationData,
        teamName,
        teamMembers: userIdOrTeamMembers,
      };
    }

    // Create a new registration document
    const registration = new RegisterTournament(registrationData);

    // Save the registration to the database
    const savedRegistration = await registration.save();

    if (registration) {
      res.status(201).json({ message: 'Registered for successfully', tournament: savedTournament });
  } else {
      res.status(500);
      throw new error("Failed to register for the tournament")    
  }

    return savedRegistration;

});

module.exports = {
  createTournament, registerForTournament,
};
