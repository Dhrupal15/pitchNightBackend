const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const multer = require("multer");
const { secret } = require("../config");
const User = require("../models/users");

const verifyUserInputs = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({ message: "Invalid fields" });
    return;
  }
  next();
};
const userIsAuthorized = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.redirect("/");
    return;
  }
  const user = jwt.verify(token, secret);
  if (!user) {
    res.clearCookie("token");
    res.redirect("/");
    return;
  }
  req.user = user;
  next();
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});
router.get("/", async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "error" });
  }
});
router.post("/login", verifyUserInputs, async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    let passwordMatched = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatched || !user) {
      return res.status(404).json({ error: "User Not found" });
    }
    let userObj = {
      email: user.email,
      password: user.password,
    };
    const token = jwt.sign(userObj, secret, { expiresIn: "2h" });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 100000,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});
let validateEmail = (email) => {
  let str = email.substr(email.length - 3);
  if (str != "com") {
    throw new Error("Domain has end with .com");
  }
  return true;
};
router.post(
  "/signup",
  upload.single("image"),
  [
    check("email")
      .notEmpty()
      .withMessage("Email is required")
      .custom((val) => validateEmail(val)),
    check("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 5 })
      .withMessage("Atleast 5 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(req.body.password, salt);
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password,
        userType: req.body.userType,
      });
      if (req.file) {
        user.image = req.file.filename;
      }
      user
        .save()
        .then((result) => {
          return res.status(201).json(result);
        })
        .catch((err) => {
          return res.status(400).json({ error: err });
        });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);
router.put("/:userId", async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        firstName,
        lastName,
        email,
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ message: "Data updated successfully", user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put("/change-password/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    const passwordMatched = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatched) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.json({ message: "Password changed successfully", user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put(
  "/profile-image",
  userIsAuthorized,
  upload.single("image"),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          image: req.file.filename,
        },
        { new: true }
      );
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
