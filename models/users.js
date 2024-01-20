const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;


const userSchema = new Schema ({

    name: String, 
    type: String,
    email: String, 
    idNum: Number 

}) 


module.exports = mongoose.model("User", userSchema)