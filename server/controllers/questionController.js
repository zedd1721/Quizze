const Question = require("../models/questionModel");
const Quiz = require("../models/quizModel");
const Option = require("../models/optionModel");
const User = require("../models/userModel");
const moment = require("moment-timezone");

module.exports.createQuestion = async (req, res) => {
  try {
    const {
      quizId,
      name,
      type,
      timer,
      question,
      optionType,
      options,
      correctOption,
    } = req.body;
    const userId = req.user._id;

    let createdQuizId = quizId;

    if (!quizId) {
      if (!name || !type) {
        return res
          .status(400)
          .json({ message: "Quiz name and Type is required." });
      }

      let finalTimer = 0;
      if (timer) {
        if (timer === 5 || timer === 10) {
          finalTimer = timer;
        } else {
          return res.status(400).json({ message: "Invalid Timer" });
        }
      }

      const newQuiz = new Quiz({
        name,
        type,
        creator: userId,
        timer: finalTimer,
        questions: [],
        createdAt: moment().tz("Asia/Kolkata").toDate(),
      });
      await newQuiz.save();

      createdQuizId = newQuiz._id;

      const user = await User.findById(userId);
      if (!user.quizzes.includes(createdQuizId)) {
        user.quizzes.push(createdQuizId);
        await user.save();
      }
    }

    if (!options || !options.length <= 2 || !options.length >= 4) {
      return res
        .status(400)
        .json({ message: "Each question must have between 2 and 4 options" });
    }

    if (!correctOption) {
      return res.status(400).json({ message: "Correct Option is required" });
    }

    const newQuestion = new Question({
      quiz: createdQuizId,
      question,
      optionType,
      options: [],
      correctOption,
    });
    await newQuestion.save();

    const createdOptions = await Promise.all(
      options.map(async (opt) => {
        const newOption = new Option({
          question: newQuestion._id,
          text: opt.text || null,
          image: opt.image || null,
        });
        await newOption.save();
        return newOption._id;
      })
    );

    newQuestion.options = createdOptions;
    await newQuestion.save();

    const quiz = await Quiz.findById(createdQuizId)
    quiz.questions.push(newQuestion._id);
    await quiz.save();

    return res
      .status(201)
      .json({ message: "Question created successfully", question: newQuestion, quizId: createdQuizId });
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

module.exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    await Option.deleteMany({ question: id });

    const quiz = await Quiz.findById(question.quiz);
    //removing the questionId from quiz questions array
    quiz.questions = quiz.questions.filter((qId) => qId.toString() !== id);
    await quiz.save();

    await Question.findByIdAndDelete(id);

    return res.status(200).json({ message: "Question Deleted" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Internal Server Error: ${error.message}` });
  }
};

module.exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { updatedOptions, correctOption } = req.body;

    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (
      !updatedOptions ||
      updatedOptions.length <= 2 ||
      updatedOptions.length >= 4
    ) {
      return res
        .status(400)
        .json({ message: "Each question must have between 2 and 4 options." });
    }

    for (const opt of updatedOptions) {
      const option = await Option.findById(opt._id);
      if (!option) {
        return res
          .status(404)
          .json({ message: `Options with ID: ${opt._id} not found` });
      }

      if (opt.newText) option.text = opt.newText;
      if (opt.newImage) option.image = opt.newImage;

      await option.save();
    }

    const correctOpt = await Option.findById(correctOption);
    if (!correctOpt) {
      return res.status(404).json({ message: "Correct option not found" });
    }

    question.correctOption = correctOption;

    await question.save();

    return res
      .status(200)
      .json({ message: "Question Updated Successfully", question });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Internal server error: ${error.message}` });
  }
};
