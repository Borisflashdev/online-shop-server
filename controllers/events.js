const Event = require('../models/eventModel');

const addEvent = async (req,res) => {
    const { name, date, description } = req.body;
    console.log(name, date, description);
    if ( !name || !date || !description || name === null || date === null || description === null) {
        res.status(400).json({ msg: `You must provide name, date and description` });
    } else {
        const event = await Event.create(req.body)
        res.status(200).json({ event });
    }
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

const getAllEvents = async (req,res) => {
    const event = await Event.find({})
    res.status(200).json({ event })
};

module.exports = {
    addEvent,
    getEvent,
    deleteEvent,
    editEvent,
    getAllEvents
};