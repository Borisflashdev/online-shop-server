const pool = require('../db/connect');
const { StatusCodes } = require('http-status-codes');

const addEvent = async (req,res) => {
    const { name, date, description, userId } = req.body;

    if (!name || !date || !description || name === null || date === null || description === null) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: `You must provide name, date, description and token` });
        return;
    }
    
    pool.execute(`
        INSERT INTO events
        VALUES (DEFAULT, "${name}", "${date}", "${description}", "${userId}")`, function(err, result) {
        if (err) {
                console.log(err);
        } else {
            res.status(StatusCodes.CREATED).json({ msg: "Event Added Successfully" });
        }
    });
};

const deleteEvent = async (req,res) => {
    const { event } = req.params
    if (!event) {
        res.status(StatusCodes.NOT_FOUND).json({ msg: `No Event with id : ${event}` });
    } else {
        pool.execute(`
        DELETE FROM events
        WHERE event_id = "${event}"`, function(err, result) {
        if (err || result.affectedRows === 0) {
            res.status(StatusCodes.NOT_FOUND).json({ msg: err || `No Event with id: ${event}` });
        } else {
            res.status(StatusCodes.OK).json({ msg: "Event Deleted Successfully" });
        }
    });
    }
};

const editEvent = async (req,res) => {
    const { event } = req.params;
    const { name, description, date } = req.body;

    if (!event) {
        res.status(StatusCodes.NOT_FOUND).json({ msg: `No Event with id: ${event}` });
    } else {
        pool.execute(`
            UPDATE events
            SET name = "${name}", date = "${date}", description = "${description}"
            WHERE event_id = "${event}"`, function(err, result) {
            if (err || result.affectedRows === 0) {
                res.status(StatusCodes.NOT_FOUND).json({ msg: err || `No Event with id: ${event}` });
            } else {
                res.status(StatusCodes.OK).json({ msg: "Event Edit Successfully" });
            }
        });
    }
};

const getEvent = async (req,res) => {
    const { event } = req.params
    if (!event) {
        res.status(StatusCodes.NOT_FOUND).json({ msg: `No Event with id: ${event}` });
    } else {
        pool.execute(`
            SELECT *
            FROM events
            WHERE  event_id = "${event}"`, function(err, result) {
            if (err || result.length === 0) {
                res.status(StatusCodes.NOT_FOUND).json({ msg: err || `No Event with id: ${event}` });
            } else {
                res.status(StatusCodes.OK).json({ result });
            }
        });
    }
};

const getAllEvents = async (req, res) => {
    const userId = req.headers.userid;
    if (!userId) {
        res.status(StatusCodes.NOT_FOUND).json({ msg: `User ${userId} does not have any events` });
    } else {
        pool.execute(`
            SELECT *
            FROM events
            WHERE user_id = "${userId}"`, function(err, result) {
            if (err) {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err });
                return;
            } else if (result.length === 0) {
                res.status(StatusCodes.OK).json({ msg: `You don't have any Events.` });
            } else {
                res.status(StatusCodes.OK).json({ result });
            }
        });
    }
};

module.exports = {
    addEvent,
    getEvent,
    deleteEvent,
    editEvent,
    getAllEvents
};