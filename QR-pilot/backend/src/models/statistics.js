const mongoose = require('mongoose');

const statisticsModel = new mongoose.Schema({
    username: {
        type: String,
        required: "username of a statistics is required"
    },
    gamesPlayed: Number,
    gamesWon: Number,
    gamesCreated: Number,
    rankings: [Number]
});

const statistics = mongoose.model('statistic', statisticsModel, 'statistics');

module.exports = statistics;
