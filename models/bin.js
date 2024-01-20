const mongoose = require("mongoose");


const Schema = mongoose.Schema;


const binSchema = new Schema ({

    wasteType: String,
    lastInteraction: Date,
    lastInteractionType: String,
    currentStatus: Number
})

module.exports = mongoose.model("Bin", binSchema)
