const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    type:{
        type: String,
        enum: ["Q&A", "Poll"],
        required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    timer:{
        type: Number,
        enum: [0 , 5, 10],
        default: 0,
    },
    questions:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
    }],
    createdAt:{
        type: Date,
        default: null,
    },
});

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;