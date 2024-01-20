const express = require('express');
const mongoose = require('mongoose')

// mongoose.connect('mongodb://localhost:27017/', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// const db = mongoose.connection;

// db.on("error", console.error.bind(console, "connection error: "));

// db.once("open", ()=> {
//     console.log("Database connection successful!");
// });

const app = express();


app.listen(3000, () => {
    console.log('Server open on port 3000');

});