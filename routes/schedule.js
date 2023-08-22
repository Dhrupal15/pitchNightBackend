const express = require("express");
const router = express.Router();
const Schedule = require("../models/schedule");
router.get("/", async (req, res) => {
  try {
    const schedule = await Schedule.find();
    res.json(schedule);
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

router.post("/create", async (req, res) => {
  try {
    const schedule = req.body;
    const result = await Schedule.insertMany(schedule);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
});
router.post("/add", async (req, res) => {
  try {
    const schedule = req.body;
    const result = await Schedule.create(schedule);
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
});

router.delete("/delete", async (req, res) => {
  try {
    const result = await Schedule.deleteMany();
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error });
  }
});
module.exports = router;
