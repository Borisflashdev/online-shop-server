const Event = require('../models/eventModel');
const User = require('../models/userModel')

const addEvent = async (req,res) => {
    const { name, date, description, token } = req.body;
    console.log(req.user);

    if (!name || !date || !description || !token || name === null || date === null || description === null || token === null) {
        res.status(400).json({ msg: `You must provide name, date, description and token` });
    }

    const event = await Event.create({ name, date, description, token });

    res.status(200).json({ event });
};

const deleteEvent = async (req,res) => {
    const { event: eventID } = req.params
    const event = await Event.findOneAndDelete({ _id: eventID })
    if (!event) {
        res.status(404).json({ msg: `No Event with id : ${eventID}` });
    } else {
        res.status(200).json({ event });
    }
};

const editEvent = async (req,res) => {
    const { event: eventID } = req.params
    const event = await Event.findOneAndUpdate({ _id: eventID }, req.body, {
        new: true,
        runValidators: true,
    });

    if (!event) {
        res.status(404).json({ msg: `No Event with id : ${eventID}` });
    } else {
        res.status(200).json({ event });
    }
};

const getEvent = async (req,res) => {
    const { event: eventID } = req.params
    const event = await Event.findOne({ _id: eventID })
    if (!event) {
        res.status(404).json({ msg: `No Event with id : ${eventID}` });
    } else {
        res.status(200).json({ event });
    }
};

const getAllEvents = async (req, res) => {
    const userToken = req.user.token;

    const events = await Event.find({token: userToken})
    res.status(200).json({ events })
};

module.exports = {
    addEvent,
    getEvent,
    deleteEvent,
    editEvent,
    getAllEvents
};