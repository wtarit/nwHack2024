const express = require("express");
const mongoose = require("mongoose");
const moment = require("moment");
const Bin = require("./models/bin");
const Trashlog = require("./models/trashlog");
var path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { auth } = require("express-openid-connect");
require("dotenv").config();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: "a long, randomly-generated string stored in env",
  baseURL: process.env.baseURL,
  clientID: "AGHO6yd1otYxYVx7CFYwYEstdQAh3OS5",
  issuerBaseURL: "https://dev-w6dlnl36kmnodfgx.us.auth0.com",
};

const dbURL = process.env.DBURL;

mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));

db.once("open", () => {
  console.log("Database connection successful!");
});

app.set("view engine", "html");
app.engine("html", require("ejs").renderFile);
app.use(express.static(path.join(__dirname, "/views")));
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.get("/", (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.redirect("/custodian");
    return;
  }
  res.render("home.html", { isAuthenticated: req.oidc.isAuthenticated() });
});

app.get("/custodian", (req, res) => {
  res.render("custodian.html");
});

app.post("/custodian", async (req, res) => {
  var targetBin = await Bin.findOne({ wasteType: req.body.wasteType });
  targetBin.currentStatus += 25;
  // targetBin.lastInteraction = new Date();
  targetBin.lastInteractionType = "fill";
  targetBin.save();

  // write log
  const trashlog = new Trashlog();
  trashlog.wasteType = req.body.wasteType;
  trashlog.custodian = "Jaydon Herwiz";
  trashlog.room = req.body.binname;
  trashlog.date = new Date();
  trashlog.save();
  res.send({ status: "success" });
});

app.get("/admin", (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    res.redirect("/");
  }
  res.render("admin.html");
});

app.get("/currentstatus", async (req, res) => {
  const allbin = await Bin.find();
  var hazardous = await Bin.findOne({ wasteType: "hazardous" });
  var anatomical = await Bin.findOne({ wasteType: "anatomical" });
  var sharps = await Bin.findOne({ wasteType: "sharps" });
  res.send({
    hazardous_amount: hazardous.currentStatus,
    hazardous_date: moment(hazardous.lastInteraction).format(
      "h:mm a, MMM Do YYYY"
    ),
    anatomical_amount: anatomical.currentStatus,
    anatomical_date: moment(anatomical.lastInteraction).format(
      "h:mm a, MMM Do YYYY"
    ),
    sharps_amount: sharps.currentStatus,
    sharps_date: moment(sharps.lastInteraction).format("h:mm a, MMM Do YYYY"),
  });
});

app.get("/trashlog", async (req, res) => {
  const trashlog = await Trashlog.find();
  res.send(
    trashlog.map((t) => {
      return {
        "wasteType": t.wasteType,
        "custodian": t.custodian,
        "room": t.room,
        "date": moment(t.date).format("h:mm a, MMM Do YYYY")
      };
    })
  );
});
app.post("/emptytrash", async (req, res) => {
  var targetBin = await Bin.findOne({ wasteType: req.body.wasteType });
  targetBin.currentStatus = 0;
  targetBin.lastInteraction = new Date();
  targetBin.lastInteractionType = "empty";
  targetBin.save();
  res.send({ status: "success" });
});

app.post("/addbin", (req, res) => {
  var current_date = new Date();
  const bin = new Bin(req.body);
  bin.lastInteraction = current_date;
  console.log(bin);
  bin.save();
  res.send({ status: "success" });
});

app.get("/map", (req, res) => {
  res.render("map.html");
});

app.listen(3000, () => {
  console.log("Server open on port 3000");
});

export default app;
