const express = require('express');
const mongoose = require('mongoose');
var path = require('path');


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