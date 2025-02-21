const mongoose = require('mongoose');

const optionScehma = new mongoose.Schema({
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true,
    },
    text: {
        type: String,
        
    },
    image: {
        type: String,
    },
})

const Option = mongoose.model('Option', optionScehma);
module.exports = Option;