const mongoose = require("mongoose");


const Schmea = mongoose.Schema;


const binSchema = new Schema ({

    wasteType: String,
    lastInteraction: Date,
    lastInteractionType: String,
    currentStatus: Number
})