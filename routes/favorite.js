const express = require("express");
const router = express.Router();
const Favorite = require("../models/favorites");

router.get("/:userId", async (req, res) => {
  try {
    const favorites = await Favorite.find({
      userId: req.params.userId,
    }).populate("pitchId");
    res.json(favorites);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newFavorite = new Favorite(req.body);
    await newFavorite.save();
    res.json(newFavorite);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/", async (req, res) => {
  try {
    await Favorite.deleteOne(req.body);
    res.json({ message: "Favorite deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
