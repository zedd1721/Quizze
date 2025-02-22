const Quiz = require("../models/quizModel");
const Option = require("../models/optionModel");
const Question = require("../models/questionModel");
const PollQuestion = require("../models/pollquestionModel");
const moment = require("moment-timezone");

// module.exports.createQuiz = async (req, res) => {
//   try {
//     const { name, type, timer } = req.body;
//     const userId = req.user._id;

//     if (!name) {
//       return res.status(400).json({ message: "Quiz Name is required" });
//     } else if (!type) {
//       return res.status(400).json({ message: "Quiz Type is required" });
//     }

//     let finalTimer = 0;
//     if (timer) {
//       if (timer === 5 || timer === 10) {
//         finalTimer = timer;
//       } else {
//         return res.status(400).json({ message: "Invalid Timer" });
//       }
//     }

//     const quiz = new Quiz({
//       name,
//       type,
//       creator: userId,
//       timer: finalTimer,
//       createdAt: moment().tz("Asia/Kolkata").toDate(),
//     });
//     await quiz.save();

//     return res.status(201).json({ message: "Quiz created successfully", quiz });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

module.exports.getQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id).populate({
      path: "questions",
      populate: { path: "options" },
    });

    if(!quiz){
        return res.status(404).json({message: 'Quiz not Found'})
    }

    return res.status(200).json(quiz);
  } catch (error) {
    return res
      .status(500)
      .json({ msg: `Internal server error: ${error.message}` });
  }
};

module.exports.deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (quiz.creator.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this quiz" });
    }

    //Find Q&A Questions in the `Question` Model
    const qnaQuestions = await Question.find({ quiz: id });
    for (let question of qnaQuestions) {
      await Option.deleteMany({ question: question._id });
    }
    await Question.deleteMany({ quiz: id });

    //If No Q&A Questions Found, Check in `PollQuestion` Model
    const pollQuestions = await PollQuestion.find({ quiz: id });
    for (let question of pollQuestions) {
      await Option.deleteMany({ question: pollQuestions._id });
    }
    await PollQuestion.deleteMany({ quiz: id });


    //Finally, Delete the Quiz from DB
    await Quiz.findByIdAndDelete(id);

    return res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
