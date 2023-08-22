const express = require("express");
const router = express.Router();
const sgMail = require("@sendgrid/mail");
const Email = require("../models/email");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/", (req, res) => {
  const { to, title, term } = req.body;
  const from = "pitch2023@gmail.com";
  const subject = "Pitch approved";
  const text = "Your pith is approved";
  const html = `<p>Congratulations!!</p> <br> <p>Your project <strong>${title}</strong> is approved for ${term}</p> <br> <br> Thank you for participating in the event. <br><br>
  Your regards, <br> Pitch Night`;
  const msg = {
    to,
    from,
    subject,
    text,
    html,
  };

  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
      res.status(200).json({ message: "Email sent successfully" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Failed to send email" });
    });
});

module.exports = router;
