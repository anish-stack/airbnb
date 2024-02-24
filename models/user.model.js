const moongoose = require('mongoose')

const UserSchema = new moongoose.Schema({

    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    DOB:{
        type: String,
        required: true
    }

}, { timestamps: true })


const User  = moongoose.model("User",UserSchema)

module.exports = User