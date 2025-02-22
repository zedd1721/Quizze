const PollQuestion = require("../models/pollquestionModel");
const Quiz = require("../models/quizModel");
const Option = require("../models/optionModel");
const User = require("../models/userModel");

module.exports.createPollQuestion = async (req, res) => {
  try {
    const { quizId, name, question, optionType, options } = req.body;
    const userId = req.user._id; // Get logged-in user ID

    let createdPollId = quizId;

    if (!quizId) {
      if (!name) {
        return res.status(400).json({ msg: "Poll name is required." });
      }

      // ✅ Create the poll only when the first question is added
      const newPoll = new Quiz({
        name,
        type: "Poll",
        creator: userId,
        questions: [],
        createdAt: moment().tz("Asia/Kolkata").toDate(),
      });

      await newPoll.save();
      createdPollId = newPoll._id;

      const user = await User.findById(userId);
      if (!user.polls.includes(createdPollId)) {
        user.polls.push(createdPollId);
        await user.save();
      }
    }

    if (!options || options.length < 2 || options.length > 4) {
      return res
        .status(400)
        .json({ msg: "Each poll must have between 2 and 4 options." });
    }

    const newPollQuestion = new PollQuestion({
      quiz: createdPollId,
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

    const poll = await Quiz.findById(createdPollId)
    poll.questions.push(newPollQuestion._id);
    await poll.save();


    return res.status(201).json({
      msg: "Poll question created successfully",
      question: newPollQuestion,
      pollId: createdPollId
    });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: `Internal server error: ${error.message}` });
  }
};

module.exports.deletePollQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ 1. Check if the poll question exists
    const pollQuestion = await PollQuestion.findById(id);
    if (!pollQuestion) {
      return res.status(404).json({ message: "Poll question not found" });
    }

    // ✅ 2. Delete all options linked to this poll question
    await Option.deleteMany({ question: id });

    // ✅ 3. Find the quiz that contains this question
    const quiz = await Quiz.findById(pollQuestion.quiz);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // ✅ 4. Remove the question ID from the quiz's questions array
    quiz.questions = quiz.questions.filter((qId) => qId.toString() !== id);
    await quiz.save();

    // ✅ 5. Delete the poll question itself
    await PollQuestion.findByIdAndDelete(id);

    return res.status(200).json({ message: "Poll Question Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: `Internal Server Error: ${error.message}` });
  }
};

module.exports.updatePollQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { updatedOptions } = req.body;

    // ✅ 1. Check if the poll question exists
    const pollQuestion = await PollQuestion.findById(id);
    if (!pollQuestion) {
      return res.status(404).json({ message: "Poll question not found" });
    }

    // ✅ 2. Ensure options count is between 2 and 4
    if (!updatedOptions || updatedOptions.length < 2 || updatedOptions.length > 4) {
      return res
        .status(400)
        .json({ message: "Each poll must have between 2 and 4 options." });
    }

    // ✅ 3. Update options
    for (const opt of updatedOptions) {
      const option = await Option.findById(opt._id);
      if (!option) {
        return res
          .status(404)
          .json({ message: `Option with ID: ${opt._id} not found` });
      }

      if (opt.newText) option.text = opt.newText;
      if (opt.newImage) option.image = opt.newImage;

      await option.save();
    }

    return res.status(200).json({ message: "Poll Question Updated Successfully", pollQuestion });
  } catch (error) {
    return res.status(500).json({ message: `Internal server error: ${error.message}` });
  }
};