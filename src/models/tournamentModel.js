const mongoose = require('mongoose');
// Define the schema for the Tournament model
const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  organizerId: { // role: host
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }],
  startDateTime: {
    type: Date,
    required: true,
  },
  endDateTime: {
    type: Date,
    required: true,
  },
  rules: {
    type: String,
    required: true,
  },
  prizes:[{name:{type:String,required:true},description:{type:String,required:true}}],
  participants:[{type:mongoose.Schema.Types.ObjectId,ref:'RegisterTournament'}]
  // Add other fields specific to your application
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create the Tournament model from the schema
const Tournament = mongoose.model('Tournament', tournamentSchema);

module.exports = Tournament;