const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const Question = require('../model/exam.model.js');

router.get('/all', async (req, res) => {
    const questionDetails = await Question.find({}).lean();
    res.status(200).json({data: questionDetails});
});

router.get('/all/:id', async (req, res) => {
    if(req.params.id == "javascript" || req.params.id == "html" || req.params.id == "css") {
        const questionDetails = await Question.find({subject: req.params.id}).lean();
        return res.status(200).json({data: questionDetails});
    } else {
        return res.status(201).json({data: "Something went wrong"});
    }
});

router.post('/add', async (req, res) => {
    if(req && req.body && req.body.question && req.body.subject && req.body.optionA && req.body.optionB && req.body.optionC && req.body.optionD && req.body.answer) {
        const newQuestion = await Question.create(req.body);
        return res.status(200).json({data: newQuestion});
    } else {
        return res.status(201).json({data: "Something went wrong!"});
    }
});

module.exports = router;