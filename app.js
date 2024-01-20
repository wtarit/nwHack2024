const express = require('express');
const mongoose = require('mongoose');
var path = require('path'); 
app.use(express.json());
app.use(express.urlencoded({extended:true}))
const { auth } = require('express-openid-connect');
require('dotenv').config();

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUERBASEURL
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

const app = express();


app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, '\/views')));
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.get("/", (req,res) => {
    res.render('home.html')
})


app.get("/custodian", (req,res) => {
    res.render('custodian.html')
})

app.get("/admin", (req,res) => {
    res.render('admin.html')
})

app.listen(3000, () => {
    console.log('Server open on port 3000');

});