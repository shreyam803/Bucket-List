const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    urls: [{
        subtitle: [{
            type: String,
            required: true,
            trim: true
        }],
        url: [{
            type: String,
            required: true,
            trim: true
        }]
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Link = mongoose.model('Link', linkSchema);

module.exports = Link;