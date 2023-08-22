const mongoose = require("mongoose");
const schema = mongoose.Schema;
const userScheme = new schema({
  firstName: String,
  lastName: String,
  image: String,
  image: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: false,
  },
  userType: {
    type: String,
    required: true,
  },
});
const User = mongoose.model("User", userScheme);
module.exports = User;
