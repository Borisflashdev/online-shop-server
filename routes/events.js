const express = require('express');
const router = express.Router();

const {
    addEvent,
    getEvent,
    deleteEvent,
    editEvent,
    getAllEvents
} = require('../controllers/events.js');

router.get('/events', getAllEvents);
router.post('/event', addEvent);
router.get('/:event', getEvent);
router.delete('/:event', deleteEvent);
router.patch('/:event', editEvent);

module.exports = router;