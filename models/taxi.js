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
    }
})

const Taxi = mongoose.model("Taxi", taxiSchema)
module.exports = Taxi