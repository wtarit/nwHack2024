const mongoose = require("mongoose");


const Schema = mongoose.Schema;


const trashlogSchema = new Schema ({

    custodian: String,
    room: String,
    wasteType: String,
    date: Date,
})

module.exports = mongoose.model("Trashlog", trashlogSchema)
