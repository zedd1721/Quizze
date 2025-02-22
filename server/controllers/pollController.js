const PollQuestion = require("../models/pollquestionModel");
const Quiz = require("../models/quizModel");
const Option = require("../models/optionModel");
const User = require("../models/userModel");

module.exports.createPollQuestion = async (req, res) => {
  try {
    const { quizId, question, optionType, options } = req.body;
    const userId = req.user._id; // Get logged-in user ID

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ msg: "Quiz not found" });
    }

    if (!options || options.length < 2 || options.length > 4) {
      return res
        .status(400)
        .json({ msg: "Each poll must have between 2 and 4 options." });
    }

    const newPollQuestion = new PollQuestion({
      quiz: quizId,
      question,
      optionType,
      options: [], // Options will be added after creation
    });

    await newPollQuestion.save();

    const createdOptions = await Promise.all(
      options.map(async (opt) => {
        const newOption = new Option({
          question: newPollQuestion._id, // Assign correct question ID
          text: opt.text || null,
          image: opt.image || null,
        });
        await newOption.save();
        return newOption._id;
      })
    );

    newPollQuestion.options = createdOptions;
    await newPollQuestion.save();

    quiz.questions.push(newPollQuestion._id);
    await quiz.save();

    const user = await User.findById(userId);
    if (!user.polls.includes(newPollQuestion._id)) {
      user.polls.push(newPollQuestion._id);
      await user.save();
    }

    return res
      .status(201)
      .json({
        msg: "Poll question created successfully",
        question: newPollQuestion,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: `Internal server error: ${error.message}` });
  }
};
