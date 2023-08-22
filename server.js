const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const mongoose = require("mongoose");
const { port, dbUri } = require("./config");
const userRouter = require("./routes/users");
const pitchRouter = require("./routes/pitch");
const eventRouter = require("./routes/event");
const scheduleRouter = require("./routes/schedule");
const favoriteRouter = require("./routes/favorite");
const emailRouter = require("./routes/email");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "./uploads")));
app.use("/api/users", userRouter);
app.use("/api/pitch", pitchRouter);
app.use("/api/event", eventRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/api/favorites", favoriteRouter);
app.use("/api/email", emailRouter);

mongoose.set("strictQuery", false);
mongoose
  .connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    app.listen(port, () => {
      console.log("Server is running on", port);
    });
  })
  .catch((err) => {
    console.log(err);
  });
app.post("/api/approve-pitch", (req, res) => {
  const msg = {
    to: req.body.to,
    from: {
      name: "Pitch Night",
      email: "pitchnight2023@gmail.com",
    },
    subject: "Pitch Approved",
    text: `Your pitch ${req.body.title} was approved`,
    html: `<p>Congratulations!!</p>  <p>Your project <strong>${req.body.title}</strong> is approved for <strong><i>${req.body.term}</i></strong>.</p> <p>Thank you for participating in the event.</p>
    <Team>Your regards,<br>Team Pitch Night</p>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      res.status(200).json({ message: "Email sent successfully" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Failed to send email" });
    });
});
