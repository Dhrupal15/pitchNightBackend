const express = require("express");
const router = express.Router();
const multer = require("multer");
const Pitch = require("../models/pitch");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image") {
      cb(null, "uploads/images");
    } else if (file.fieldname === "file") {
      cb(null, "uploads/files");
    }
  },
  filename: (req, file, cb) => {
    if (file.fieldname === "image") {
      cb(null, file.originalname);
    } else if (file.fieldname === "file") {
      cb(null, Date.now() + "-" + file.originalname);
    }
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // set maximum file size limit to 10 MB
  },
});
router.post("/send-email", (req, res) => {
  const { to, subject, body } = req.body;
  sendEmail(to, subject, body);
  res.status(200).send("Email sent");
});

// create a new pitch
router.post("/", upload.fields([{ name: "image" }]), async (req, res) => {
  try {
    const {
      clientName,
      contactName,
      email,
      website,
      phone,
      projectName,
      projectDescription,
      term,
      businessGoals,
      additionalNotes,
      isApproved,
      userId,
    } = req.body;

    const image = req.files["image"][0].filename;
    const timestamp = Date.now();

    const pitch = new Pitch({
      clientName,
      contactName,
      email,
      website,
      phone,
      projectName,
      projectDescription,
      term,
      businessGoals,
      additionalNotes,
      timestamp,
      isApproved,
      userId,
      image,
    });

    await pitch.save();

    res.json(pitch);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// get all pitches
router.get("/", async (req, res) => {
  try {
    const pitches = await Pitch.find();

    res.json(pitches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});
router.get("/isApproved", async (req, res) => {
  try {
    const pitches = await Pitch.find({ isApproved: true });

    res.json(pitches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const pitches = await Pitch.find({ userId });

    res.json(pitches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// update a pitch by id
router.put("/:id", async (req, res) => {
  try {
    const {
      clientName,
      contactName,
      email,
      website,
      phone,
      projectName,
      projectDescription,
      term,
      businessGoals,
      additionalNotes,
      isApproved,
    } = req.body;
    const id = req.params.id;
    const pitch = await Pitch.findById(id);

    if (!pitch) {
      return res.status(404).json({ error: "Pitch not found." });
    }

    // update the pitch with the new data
    pitch.clientName = clientName;
    pitch.contactName = contactName;
    pitch.email = email;
    pitch.website = website;
    pitch.phone = phone;
    pitch.projectName = projectName;
    pitch.projectDescription = projectDescription;
    pitch.term = term;
    pitch.businessGoals = businessGoals;
    pitch.additionalNotes = additionalNotes;
    pitch.isApproved = isApproved;

    await pitch.save();

    res.json(pitch);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// delete a pitch by id
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const pitch = await Pitch.findById(id);

    if (!pitch) {
      return res.status(404).json({ error: "Pitch not found." });
    }

    await pitch.delete();

    res.json({ message: "Pitch deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// router.get("/download/:filename", (req, res) => {
//   const filename = req.params.filename;
//   const filePath = path.join(__dirname, "../uploads/files", filename);
//   console.log("===========FilePath=========================");
//   console.log(filePath);
//   console.log("====================================");
//   // Check if the file exists
//   if (fs.existsSync(filePath)) {
//     // Set headers for the response
//     res.setHeader("Content-Type", "application/octet-stream");
//     res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

//     // Create a read stream from the file path and pipe it to the response
//     const fileStream = fs.createReadStream(filePath);
//     fileStream.pipe(res);
//   } else {
//     res.status(404).json({ error: "File not found." });
//   }
// });

module.exports = router;
