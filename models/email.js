const mongoose = require("mongoose");
const schema = mongoose.Schema;
const emailSchema = new schema({
  to: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  html: {
    type: String,
    required: true,
  },
});

const Email = mongoose.model("Email", emailSchema);
module.exports = Email;
