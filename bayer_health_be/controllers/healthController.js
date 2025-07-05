const HealthTopic = require('../models/HealthTopic');

// @desc    Get all health topics
// @route   GET /api/health-topics
// @access  Public
exports.getAllHealthTopics = async (req, res, next) => {
    try {
        const topics = await HealthTopic.find({});

        res.status(200).json({
            status: 'success',
            results: topics.length,
            data: {
                topics
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get health topic by ID
// @route   GET /api/health-topics/:id
// @access  Public
exports.getHealthTopicById = async (req, res, next) => {
    try {
        const topic = await HealthTopic.findById(req.params.id);

        if (!topic) {
            return res.status(404).json({
                status: 'error',
                message: 'Health topic not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                topic
            }
        });
    } catch (error) {
        next(error);
    }
}; 