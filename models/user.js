const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    rollNo: {
        type: String,
        required: true,
        validate: {
            validator: (value) => value.startsWith('IMT') && value.length == 10,
            message: props => `${props.value} is not a valid roll no`
        }
    },
    name: {
        type: String,
        required: true
    },
    phoneNo: {
        type: Number,
        validate: {
            validator: value => value.toString().length == 10,
            message: props => `${props.value} is not a vald phone no`
        }
    },
    password: {
        type: String,
        required: true
    },
    scheduledTaxis: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'taxis' // reference to the 'taxis' collection
    }
})

const User = mongoose.model("User", userSchema)
module.exports = User