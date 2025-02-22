const Question = require("../models/questionModel");
const Option = require("../models/optionModel");

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