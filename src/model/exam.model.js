const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {type: String, required: true},
    subject: {type: String, required: true},
    optionA: {type: String, required: true},
    optionB: {type: String, required: true},
    optionC: {type: String, required: true},
    optionD: {type: String, required: true},
    answer: {type: String, required: true},
    credits: {type: Number, required: true},
});

const Question = mongoose.model('question', questionSchema);
module.exports = Question;