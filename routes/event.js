const express = require("express");
const router = express.Router();
const Event = require("../models/event");

router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.send(events);
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET a specific event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).send("Event not found");
    }
    res.send(event);
  } catch (err) {
    res.status(500).send(err);
  }
});

// POST a new event
router.post("/create", async (req, res) => {
  const event = new Event({
    speaker: req.body.speaker,
  });

  try {
    await event.save();
    res.send(event);
  } catch (err) {
    res.status(500).send(err);
  }
});

// DELETE an event by ID
router.delete("/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).send("Event not found");
    }
    res.send(event);
  } catch (err) {
    res.status(500).send(err);
  }
});

// UPDATE an event by ID
router.put("/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      return res.status(404).send("Event not found");
    }
    res.send(event);
  } catch (err) {
    res.status(500).send(err);
  }
});
module.exports = router;
