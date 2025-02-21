const mongoose = require('mongoose');

const optionScehma = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
    },
    text: {
        type: String,
        default: null,
    },
    image: {
        type: String,
        default: null,
    },
})

const Option = mongoose.model('Option', optionScehma);
module.exports = Option;