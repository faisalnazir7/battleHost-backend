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


//+++++++++ function to display all the tournaments+++++++++++++++++++
const getAllTournaments=asyncHandler(async(req,res)=>{
  const allTournaments=await Tournament.find()
  if(!allTournaments){
    res.status(404)
    throw new error("No upcoming tournaments")
  }
  return res.status(200).json({allTournaments})
  
  }
  )
  
  //+++++++++ function to get details of a particular tournament+++++++++++++++++++
  const tournamentDetails=asyncHandler(async(req,res)=>{
    const getTournamentDetails=await Tournament.find({_id:req.params.tournamentId})
    if(!getTournamentDetails){
      res.status(404);
      throw new error("Tournament not found")
    }
    return res.status(200).json({getTournamentDetails})
  })
  

    
  //+++++++++ function to get register for a particular tournament+++++++++++++++++++
  const registerUserForTournament=asyncHandler(async(req,res)=>{
    const {tournament,registrationType,teamName,teamMembers}=req.body
    if(!tournament || !registrationType){
      res.status(422);
      throw new error('Some fields are missing')
    }
    //Validating tournament id
    const findTournament=await Tournament.findOne({_id:tournament})
    if(!findTournament){
      res.status(404);
      throw new error('Tournament not found')
    }
    //Checking whether the user is trying to register after the start date
const currentDate=new Date()
const tournamentStartDate=new Date(findTournament.startDateTime)
if(currentDate>=tournamentStartDate){
  res.status(410);
  throw new error('Registration closed')
}
//Checking if the user is an organizer or not
const isOrganizer=await User.findOne({_id:req.user._id,role:'organizer'})
if(isOrganizer){
  res.status(422);
  throw new error('Organizer cannot participate')
}
//Checking if the user has already registered
const existingParticipant=await RegisterTournament.findOne({user:req.user._id,tournament:tournament})
if(existingParticipant){
  res.status(409);
  throw new error('User already registered')
}
//if a single user is registering for the event
if(registrationType==='individual'){
  const newRegistration = new RegisterTournament({
    user:req.user._id,
    tournament:findTournament._id,
    registrationType,
  })
  //saving individual registration
  const saveRegistration=await newRegistration.save()
  if(!saveRegistration){
    res.status(500);
    throw new error('Couldnt register user')
  }
  //updating the participants array for the tournament schema
  const tournamentUpdate=await Tournament.findByIdAndUpdate({_id:tournament},{
    $push:{participants:saveRegistration._id}},{new:true}
  )
  if(!tournamentUpdate){
    res.status(500);
    throw new error('Couldnt add participant')
  }
  return res.status(200).json({message:'User registered successfully'})
}
// If the team registers for the event 
if(registrationType==='team'){
  const teamNameExists=await RegisterTournament({registrationType:'team',teamName:teamName})
  if(teamNameExists){
    res.status(409);
    throw new error('Team name is already taken')
  }
  //checking in the team members array whether participant exists or not
  const alreadyParticipating=await RegisterTournament.find({tournament:tournament,teamMembers:{$in:[req.user._id]}})
  if(alreadyParticipating){
    res.status(409);
    throw new error('Participant already registered in some team')
  }
const newTeamRegistration= new RegisterTournament({
  user:req.user._id,
  tournament:findTournament._id,
  registrationType,
  teamName,
  teamMembers
})
//saving team registration
const saveTeamRegistration=await newTeamRegistration.save()
if(!saveTeamRegistration){
  res.status(500);
  throw new error('Couldnt register team')
}
  //updating the participants array for the tournament schema
const tournamentUpdate=await Tournament.findByIdAndUpdate({_id:tournament},{
  $push:{participants:saveTeamRegistration._id}},{new:true}
)
if(!tournamentUpdate){
  res.status(500);
  throw new error('Couldnt add participants')
}
return res.status(200).json({message:'Team registered successfully'})
}
  
  })
  module.exports = {
    createTournament, registerForTournament, tournamentDetails,getAllTournaments,registerUserForTournament
  };
