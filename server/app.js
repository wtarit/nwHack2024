const express = require('express');
const mongoose = require('mongoose')


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


app.listen(3000, () => {
    console.log('Server open on port 3000');

});