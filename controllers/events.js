const pool = require('../db/connect');
const { StatusCodes } = require('http-status-codes');

const addEvent = async (req,res) => {
    const { name, date, description, token } = req.body;

    if (!name || !date || !description || !token || name === null || date === null || description === null || token === null) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: `You must provide name, date, description and token` });
        return;
    }

    pool.execute(`
        INSERT INTO events
        VALUES (DEFAULT, "${name}", "${date}", "${description}", "${token}")`, function(err, result) {
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
    const userToken = req.user.token;
    if (!userToken) {
        res.status(StatusCodes.NOT_FOUND).json({ msg: `User ${userToken} does not have any events` });
    } else {
        pool.execute(`
            SELECT *
            FROM events
            WHERE token = "${userToken}"`, function(err, result) {
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