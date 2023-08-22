const mongoose = require("mongoose");
const schema = mongoose.Schema;
const favoriteSchema = new schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pitchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pitch",
    required: true,
  },
});
const Favorite = mongoose.model("Favorite", favoriteSchema);
module.exports = Favorite;
