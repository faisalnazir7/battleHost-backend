const mongoose = require("mongoose");
// Define the schema for the Tournament model
const tournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    organizerId: {
      // role: host
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String, // This field stores the category of the tournament
      enum: ["Tournament", "Hackathon", "Event"], // Define the allowed category values
      required: true,
    },
    startDateTime: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          // 'this' refers to the document being validated
          return value <= this.endDateTime; // Check if start date is not ahead of end date
        },
        message: "Start date cannot be ahead of end date",
      },
    },
    endDateTime: {
      type: Date,
      required: true,
    },
    rules: {
      type: String,
      required: true,
    },
    prizes: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "RegisterTournament" },
    ],
    bannerImg: {
      type: String,
      default:
        "https://drive.google.com/uc?export=view&id=1vRUMZuKrilPnBwltoNkABS3V7AhEJAX0",
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
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Tournament model from the schema
const Tournament = mongoose.model("Tournament", tournamentSchema);

module.exports = Tournament;
