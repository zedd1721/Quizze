const Question = require("../models/questionModel");
const Quiz = require("../models/quizModel");
const Option = require("../models/optionModel");
const User = require("../models/userModel")

module.exports.createQuestion = async (req, res) => {
    try {

        const { quizId, question, optionType, options, correctOption } = req.body;
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        if(!options || !options.length<=2 || !options.length>=4){
            return res.status(400).json({message: "Each question must have between 2 and 4 options"});
        }

        if(!correctOption){
            return res.status(400).json({message: "Correct Option is required"});
        }

        const newQuestion = new Question({
            quiz: quizId,
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

        quiz.questions.push(newQuestion._id);
        await quiz.save();

        
        const user = await User.findById(req.user._id);
        if(!user.quizzes.includes(quizId)){
            user.quizzes.push(quizId);
            await user.save();
        }

        return res.status(201).json({ message: "Question created successfully", newQuestion });
        
    } catch (error) {
        return res.status(400).json({ message: `Internal Server Error: ${error.message}` });
    }
}

module.exports.deleteQuestion = async (req, res) => {
    try{
        const {id} = req.params;

        const question = await Question.findById(id);
        if(!question){
            return res.status(404).json({message: 'Question not found'})
        }

        await Option.deleteMany({question: id});

        const quiz = await Quiz.findById(question.quiz)
        //removing the questionId from quiz questions array
        quiz.questions = quiz.questions.filter(qId => qId.toString() !== id);
        await quiz.save();

        await Question.findByIdAndDelete(id);

        return res.status(200).json({message: 'Question Deleted'});

    }catch(error){
        return res.status(400).json({ message: `Internal Server Error: ${error.message}` });
    }
}

module.exports.updateQuestion = async(req, res) => {
    try{
        const {id} = req.params;
        const{ updatedOptions, correctOption} = req.body;

        const question = await Question.findById(id);
        if(!question){
            return res.status(404).json({message: "Question not found"})
        }

        if(!updatedOptions || updatedOptions.length <= 2 || updatedOptions.length >= 4){
            return res.status(400).json({message: "Each question must have between 2 and 4 options."})
        }

        for(const opt of updatedOptions){
            const option = await Option.findById(opt._id);
            if(!option){
                return res.status(404).json({message: `Options with ID: ${opt._id} not found`})
            }

            if(opt.newText) option.text = opt.newText;
            if(opt.newImage) option.image = opt.newImage;

            await option.save();
        }

        const correctOpt = await Option.findById(correctOption);
        if(!correctOpt){
            return res.status(404).json({message: 'Correct option not found'})
        }

        question.correctOption = correctOption;

        await question.save();

        return res.status(200).json({message: 'Question Updated Successfully', question})


    }catch(error){
        return res.status(500).json({ message: `Internal server error: ${error.message}` });
    }
}

module.exports.deleteOption = async(req, res) => {
    
    try{
        const {id} = req.params;
        const option = await Option.findById(id);
        if(!option){
            return res.status(404).json({message: 'Options not found'});
        }
    
        const question = await Question.findById(option.question);
        if(!question){
            return res.status(404).json({message: 'No questions found'})
        }
    
        question.options = question.options.filter(oId => oId.toString() !== id)
        await question.save();
    
        await Option.findByIdAndDelete(id);
    
        return res.status(200).json({message: 'Option Deleted'})

    }catch(error){
        return res.status(400).json({ message: `Internal Server Error: ${error.message}` });
    }
}