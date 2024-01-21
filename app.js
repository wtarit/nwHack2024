const express = require('express');
const mongoose = require('mongoose');
const Bin = require('./models/bin');
var path = require('path'); 
import { getVenue, showVenue, E_SDK_EVENT } from '@mappedin/mappedin-js';
import '@mappedin/mappedin-js/lib/index.css';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
const { auth } = require('express-openid-connect');
require('dotenv').config();

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'a long, randomly-generated string stored in env',
    baseURL: 'http://localhost:3000',
    clientID: 'AGHO6yd1otYxYVx7CFYwYEstdQAh3OS5',
    issuerBaseURL: 'https://dev-w6dlnl36kmnodfgx.us.auth0.com'
  }; 



const dbURL = 'mongodb+srv://wtarit:PsdByICI2OqOq25P@cluster0.akdqfhs.mongodb.net/?retryWrites=true&w=majority'


mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));

db.once("open", ()=> {
    console.log("Database connection successful!");
});


app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, '\/views')));
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));



// async function init() {
// 	const venueData = await getVenue({
// 		clientId: '<clientId>',
// 		clientSecret: '<clientSecret>',
// 		venue: '<venue>',
// 	});

// 	const mapView = await showVenue(document.getElementById('mappedin-map'), venueData);
// 	mapView.FloatingLabels.labelAllLocations();
// 	mapView.addInteractivePolygonsForAllLocations();
// 	mapView.on(E_SDK_EVENT.CLICK, ({ polygons }) => {
// 		console.log(`Polygon with id ${polygons[0].id} clicked!`);
// 	});
// }
// document.addEventListener('DOMContentLoaded', init);

app.get("/", (req,res) => {
    console.log(req.oidc.isAuthenticated());
    res.render('home.html',{isAuthenticated: req.oidc.isAuthenticated()});
})


app.get("/custodian", (req,res) => {
    res.render('custodian.html')
})

app.post("/custodian", async (req, res) => {
    var targetBin = await Bin.findOne({"wasteType":req.body.wasteType})
    targetBin.currentStatus += 25
    targetBin.lastInteraction = new Date();
    targetBin.lastInteractionType = "fill";
    targetBin.save()
    res.send({"status":"success"})
})

app.get("/admin", (req,res) => {

    if (!req.oidc.isAuthenticated()) {

        res.redirect("/");

    }
    res.render('admin.html')
})

app.post("/addbin", (req, res) => {
    var current_date = new Date();
    const bin = new Bin(req.body)
    bin.lastInteraction = current_date
    console.log(bin)
    bin.save()
    res.send({"status":"success"})
})

app.listen(3000, () => {
    console.log('Server open on port 3000');

});