const mongoose = require('mongoose');
const { Schema } = mongoose;

const eventSchema = new Schema({
    name: {
        type: String,
        require: [true, 'Name is Required']
    },
    date: {
        type: Date,
        require: [true, 'Date is Required']
    },
    description: {
        type: String,
        require: [true, 'Description is Required']
    },
    token: {
        type: String,
        require: [true, 'Token is Required']
    }
});

module.exports = mongoose.model('Event', eventSchema);