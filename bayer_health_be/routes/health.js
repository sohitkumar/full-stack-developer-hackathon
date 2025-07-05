const express = require('express');
const healthController = require('../controllers/healthController');

const router = express.Router();

// @desc    Get all health topics
// @route   GET /api/health-topics
// @access  Public
router.get('/', healthController.getAllHealthTopics);

// @desc    Get single health topic
// @route   GET /api/health-topics/:id
// @access  Public
router.get('/:id', healthController.getHealthTopicById);

module.exports = router; 