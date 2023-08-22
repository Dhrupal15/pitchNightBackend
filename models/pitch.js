const mongoose = require("mongoose");

const pitchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  contactName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  projectDescription: {
    type: String,
    required: true,
  },
  term: {
    type: String,
    required: true,
  },
  businessGoals: {
    type: String,
    required: true,
  },
  additionalNotes: {
    type: String,
    required: false,
  },
  term: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
  isApproved: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Pitch", pitchSchema);
