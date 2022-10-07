const express = require('express');
const router = express.Router();

const {
    addEvent,
    getEvent,
    deleteEvent,
    editEvent,
    getAllEvents
} = require('../controllers/events.js');

const authorizationMiddleware = require('../middleware/auth.js');

router.get('/events', authorizationMiddleware, getAllEvents);
router.post('/event', authorizationMiddleware, addEvent);
router.get('/:event', authorizationMiddleware, getEvent);
router.delete('/:event', authorizationMiddleware, deleteEvent);
router.patch('/:event', authorizationMiddleware, editEvent);

module.exports = router;