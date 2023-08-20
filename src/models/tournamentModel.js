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
  participants:[{type:mongoose.Schema.Types.ObjectId,ref:'RegisterTournament'}],
  bannerImg: {
    type: String,
    default: "https://drive.google.com/file/d/1vRUMZuKrilPnBwltoNkABS3V7AhEJAX0/view?usp=sharing",
  },
  teamSize: {
    type: String,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  // Add other fields specific to your application
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

// Create the Tournament model from the schema
const Tournament = mongoose.model('Tournament', tournamentSchema);

module.exports = Tournament;