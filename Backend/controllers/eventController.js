const Event = require('../models/Event');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

// Helper function to create URL slug from event name
const createSlug = (name) => {
  return (name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// @desc    Get all events with search, filter, and sorting
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    const { q, category, industry, city, country, status, sortBy, sortOrder } = req.query;

    let query = {};

    // Search query by name, description, venue, or city
    if (q && q.trim()) {
      const searchRegex = new RegExp(q.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { venue: searchRegex },
        { city: searchRegex },
        { category: searchRegex },
        { industry: searchRegex }
      ];
    }

    // Filters
    if (category && category !== 'ALL') {
      query.category = category;
    }

    if (industry && industry !== 'ALL') {
      query.industry = industry;
    }

    if (city && city !== 'ALL') {
      query.city = city;
    }

    if (country && country !== 'ALL') {
      query.country = country;
    }

    if (status && status !== 'ALL') {
      query.status = status;
    }

    // Sorting
    let sort = { startDate: 1 };
    if (sortBy === 'name') {
      sort = { name: sortOrder === 'desc' ? -1 : 1 };
    } else if (sortBy === 'startDate') {
      sort = { startDate: sortOrder === 'desc' ? -1 : 1 };
    } else if (sortBy === 'createdAt') {
      sort = { createdAt: sortOrder === 'asc' ? 1 : -1 };
    }

    const events = await Event.find(query).sort(sort);

    const stats = {
      total: events.length,
      upcoming: events.filter(e => e.status === 'UPCOMING').length,
      ongoing: events.filter(e => e.status === 'ONGOING').length,
      completed: events.filter(e => e.status === 'COMPLETED').length,
      draft: events.filter(e => e.status === 'DRAFT').length
    };

    res.status(200).json({
      success: true,
      count: events.length,
      stats,
      data: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events',
      error: error.message
    });
  }
};

// @desc    Get single event by ID or Event Name Slug
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res) => {
  try {
    const identifier = req.params.id;
    let event = null;

    // Check if identifier is valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      event = await Event.findById(identifier);
    }

    // If not found by ObjectId, search by Event Name slug
    if (!event) {
      const allEvents = await Event.find();
      event = allEvents.find(e => createSlug(e.name) === identifier.toLowerCase());
    }

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found: ${identifier}`
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving event details',
      error: error.message
    });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Public / Admin
exports.createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      name,
      description,
      category,
      industry,
      startDate,
      endDate,
      venue,
      city,
      country,
      organizer,
      website,
      image,
      status
    } = req.body;

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({
        success: false,
        message: 'End date cannot be earlier than Start date'
      });
    }

    const event = await Event.create({
      name,
      description,
      category,
      industry,
      startDate,
      endDate,
      venue,
      city,
      country,
      organizer,
      website: website || '',
      image: image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      status: status || 'UPCOMING'
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating event',
      error: error.message
    });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Public / Admin
exports.updateEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with ID: ${req.params.id}`
      });
    }

    if (req.body.startDate && req.body.endDate) {
      if (new Date(req.body.endDate) < new Date(req.body.startDate)) {
        return res.status(400).json({
          success: false,
          message: 'End date cannot be earlier than Start date'
        });
      }
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating event',
      error: error.message
    });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Public / Admin
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: `Event not found with ID: ${req.params.id}`
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: `Event '${event.name}' has been deleted successfully`,
      data: { id: req.params.id }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting event',
      error: error.message
    });
  }
};

// @desc    Seed database with sample events
// @route   POST /api/events/seed
// @access  Public / Admin
exports.seedEvents = async (req, res) => {
  try {
    const sampleEvents = require('../seedData');
    await Event.deleteMany({});
    const createdEvents = await Event.insertMany(sampleEvents);

    res.status(201).json({
      success: true,
      message: `Database seeded successfully with ${createdEvents.length} sample events`,
      count: createdEvents.length,
      data: createdEvents
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while seeding database',
      error: error.message
    });
  }
};
