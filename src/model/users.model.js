const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // _id: {type: String, required: false},
    userId: {type: String},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    number: {type: String},
    profilePic: {type: String},
    age: {type: Number},
    gender: {type: String},
});

const User = mongoose.model('user', userSchema);
module.exports = User;