const mongoose = require("mongoose");
const schema = mongoose.Schema;

// Define the event schema
const eventScheme = new schema({
  speaker: {
    type: String,
    required: true,
  },
});

const Event = mongoose.model("Event", eventScheme);
module.exports = Event;
