const mongoose = require('mongoose')

const taxiSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    people: {
        type: [mongoose.Schema.Types.ObjectId],
        // required: true,
        ref: 'users'
    },
    hours: {
        type: Number,
        required: true
    },
    minutes: {
        type: Number,
        required: true
    },
})

const Taxi = mongoose.model("Taxi", taxiSchema)
module.exports = Taxi