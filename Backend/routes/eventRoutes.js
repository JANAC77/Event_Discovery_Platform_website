const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  seedEvents
} = require('../controllers/eventController');

// Input validation rules for create/update
const eventValidationRules = [
  check('name', 'Event name is required').notEmpty().trim(),
  check('description', 'Description is required').notEmpty().trim(),
  check('category', 'Category is required').notEmpty().trim(),
  check('industry', 'Industry is required').notEmpty().trim(),
  check('startDate', 'Valid start date is required').isISO8601().toDate(),
  check('endDate', 'Valid end date is required').isISO8601().toDate(),
  check('venue', 'Venue is required').notEmpty().trim(),
  check('city', 'City is required').notEmpty().trim(),
  check('country', 'Country is required').notEmpty().trim(),
  check('organizer', 'Organizer name is required').notEmpty().trim()
];

// Routes matching specification:
// POST   /api/events
// GET    /api/events
// GET    /api/events/:id
// PUT    /api/events/:id
// DELETE /api/events/:id

router.route('/')
  .get(getEvents)
  .post(eventValidationRules, createEvent);

router.post('/seed', seedEvents);

router.route('/:id')
  .get(getEventById)
  .put(updateEvent)
  .delete(deleteEvent);

module.exports = router;
