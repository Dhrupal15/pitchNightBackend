const mongoose = require("mongoose");
const schema = mongoose.Schema;

// Define the Schedule schema
const scheduleScheme = new schema({
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  speaker: {
    type: String,
    required: true,
  },
});

const Schedule = mongoose.model("Schedule", scheduleScheme);
module.exports = Schedule;
