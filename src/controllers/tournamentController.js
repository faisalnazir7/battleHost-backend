const asyncHandler = require("express-async-handler");
const Tournament = require('../models/tournamentModel');
const RegisterTournament = require('../models/registerTournamentModel');
const User  = require("../models/userModel");

// ++++++++++++++++ Function to handle creating a new tournament ++++++++++

const createTournament = asyncHandler(async (req, res) => {

      const { name, description, startDateTime, endDateTime, rules, prizes, location, teamSize, bannerImg, participants } = req.body;

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
        location,
        teamSize,
        bannerImg,
        participants,
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

// const registerForTournament = asyncHandler(async (userIdOrTeamMembers, tournamentId, registrationType, teamName = null) => {
//   let registrationData = {
//     user: userIdOrTeamMembers, // from params or req.user._id
//     tournament: tournamentId, // from params or req.tournament._id
//     registrationType,
//   };

//   if (registrationType === 'team') {
//     if (!teamName || !Array.isArray(userIdOrTeamMembers)) {
//       throw new Error('For team registration, provide a team name and an array of team members (user IDs).');
//     }

//     registrationData = {
//       ...registrationData,
//       teamName,
//       teamMembers: userIdOrTeamMembers,
//     };
//   }

//   // Create a new registration document
//   const registration = new RegisterTournament(registrationData);

//   // Save the registration to the database
//   const savedRegistration = await registration.save();

//   if (savedRegistration) {
//     res.status(201).json({ message: 'Registered successfully', tournament: savedTournament });
//   } else {
//     res.status(500);
//     throw new Error("Failed to register for the tournament");
//   }

//   return savedRegistration;
// });


//+++++++++ function to display all the tournaments+++++++++++++++++++
const getAllTournaments=asyncHandler(async(req,res)=>{
  const allTournaments=await Tournament.find().sort({_id:-1}).populate('organizerId','name')
  if(!allTournaments){
    res.status(404)
    throw new error("No upcoming tournaments")
  }
  return res.status(200).json({allTournaments})
  
  }
  )
  
  //+++++++++ function to get details of a particular tournament+++++++++++++++++++
  const tournamentDetails=asyncHandler(async(req,res)=>{
    const getTournamentDetails=await Tournament.find({_id:req.params.tournamentId}).populate('organizerId','name').populate({
      path: 'participants',
      populate: {
        path: 'user',
        select: 'email photo', // Select specific fields from the user document if needed
      },
      select: 'user teamName teamMembers registrationType', // Select fields from the participants document
    });
    if(!getTournamentDetails){
      res.status(404);
      throw new error("Tournament not found")
    }
    return res.status(200).json({getTournamentDetails})
  })
  

    
  //+++++++++ function to get register for a particular tournament+++++++++++++++++++
  
  const registerUserForTournament = asyncHandler(async (req, res) => {
    const { tournament, registrationType, teamName, teamMembers } = req.body;
    if (!tournament || !registrationType) {
      res.status(422);
      throw new Error('Some fields are missing');
    }
  
    // Validating tournament id
    const findTournament = await Tournament.findOne({ _id: tournament });
    if (!findTournament) {
      res.status(404);
      throw new Error('Tournament not found');
    }
  
    // Checking whether the user is trying to register after the start date
    const currentDate = new Date();
    const tournamentStartDate = new Date(findTournament.startDateTime);
    if (currentDate >= tournamentStartDate) {
      res.status(410);
      throw new Error('Registration closed');
    }
  
    // Checking if the user is an organizer or not
    const isOrganizer = await User.findOne({ _id: req.user._id, role: 'organizer' });
    if (isOrganizer) {
      res.status(422);
      throw new Error('Organizer cannot participate');
    }
  
    // Checking if the user has already registered
    const existingParticipant = await RegisterTournament.findOne({ user: req.user._id, tournament });
    if (existingParticipant) {
      res.status(409);
      throw new Error('User already registered');
    }
  
    if (registrationType === 'individual') {
      const newRegistration = new RegisterTournament({
        user: req.user._id,
        tournament: findTournament._id,
        registrationType,
      });
      const saveRegistration = await newRegistration.save();
      if (!saveRegistration) {
        res.status(500);
        throw new Error('Could not register user');
      }
      const tournamentUpdate = await Tournament.findByIdAndUpdate(
        { _id: tournament },
        { $push: { participants: saveRegistration._id } },
        { new: true }
      );
      if (!tournamentUpdate) {
        res.status(500);
        throw new Error('Could not add participant');
      }
      return res.status(200).json({ message: 'User registered successfully' });
    } else if (registrationType === 'team') {
      const teamNameExists = await RegisterTournament.findOne({ registrationType: 'team', teamName });
      if (teamNameExists) {
        res.status(409);
        throw new Error('Team name is already taken');
      }
      const alreadyParticipating = await RegisterTournament.find({ tournament, teamMembers: { $in: [req.user._id] } });
      if (alreadyParticipating && alreadyParticipating.length > 0) {
        res.status(409);
        throw new Error('Participant already registered in some team');
      }
      const newTeamRegistration = new RegisterTournament({
        user: req.user._id,
        tournament: findTournament._id,
        registrationType,
        teamName,
        teamMembers,
      });
      const saveTeamRegistration = await newTeamRegistration.save();
      if (!saveTeamRegistration) {
        res.status(500);
        throw new Error('Could not register team');
      }
      const tournamentUpdate = await Tournament.findByIdAndUpdate(
        { _id: tournament },
        { $push: { participants: saveTeamRegistration._id } },
        { new: true }
      );
      if (!tournamentUpdate) {
        res.status(500);
        throw new Error('Could not add participants');
      }
      return res.status(200).json({ message: 'Team registered successfully' });
    } else {
      res.status(422);
      throw new Error('Invalid registration type');
    }
  });

  module.exports = {
    createTournament, tournamentDetails, getAllTournaments, registerUserForTournament
  };
