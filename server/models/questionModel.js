const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  optionType: {
    type: String,
    enum: ["text", "image", "text+image"],
    required: true,
  },
  options: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Option",
      validate: {
        validator: function (options) {
          return options.length >= 2 && options.length <= 4; // Validate number of options
        },
        message: "Each question must have between 2 and 4 options.",
      },
    },
  ],
  correctOption: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Option",
  },
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
