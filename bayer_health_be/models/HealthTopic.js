const mongoose = require('mongoose');

const healthTopicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('HealthTopic', healthTopicSchema); 