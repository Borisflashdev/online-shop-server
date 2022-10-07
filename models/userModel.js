const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        require: [true, 'Username is Required']
    },
    password: {
        type: String,
        require: [true, 'Password is Required']
    },
    token: {
        type: String,
        require: [true, 'String is Required']
    }
});

module.exports = mongoose.model('User', userSchema);