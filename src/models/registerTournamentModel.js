const mongoose = require('mongoose');

const registerTournamentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true,
  },
  registrationType: {
    type: String,
    enum: ['individual', 'team'], // Possible values: 'individual' or 'team'
    default: 'individual', // Default value is 'individual'
  },
  teamName: {
    type: String,
    // Required if registrationType is 'team'
    required: function () {
      return this.registrationType === 'team';
    },
  },
  teamMembers: [{
    type: String, // Change the type to String to store the email addresses
    required: function () {
      return this.registrationType === 'team';
    },
  }],
},
{
  timestamps: true,
},
);

// Create the RegisterTournament model
const RegisterTournament = mongoose.model('RegisterTournament', registerTournamentSchema);

module.exports = RegisterTournament;
