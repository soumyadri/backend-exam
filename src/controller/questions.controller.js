const express = require('express');
const router = express.Router();
var mongodb = require('mongodb');
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

router.post('/checkResult', async (req, res) => {
    if (req && Object.keys(req.body).length > 0) {
        let calculateMarks = 0;
        let questionCorrect = 0;
        let questionWrong = 0;
        for (let key in req.body) {
            let questionDetails = await Question.findById(key).lean().exec();
            if (questionDetails?.answer === req.body[key]) {
                calculateMarks += questionDetails.credits;
                questionCorrect += 1;
            } else {
                questionWrong += 1;
            }
        }
        let status = 0;
        if(calculateMarks >= 4) {
            status = 1;
        }
        return res.status(200).json({ data: {marks: calculateMarks, status: status, right: questionCorrect, wrong: questionWrong}});
    } else {
        if(req && Object.keys(req.body).length == 0) {
            return res.status(200).json({ data: {marks: 0, status: 0}});
        }
        return res.status(201).json({data: "Something went wrong!"});
    }
});

router.post('/edit/:id', async (req, res) => {
    if (req.params.id != "undefined" && req && req.body && req.body.question && req.body.subject && req.body.optionA && req.body.optionB && req.body.optionC && req.body.optionD && req.body.answer) {
        const questionDetails = await Question.updateOne({"id": req.params.id}, {$set: req?.body}).lean().exec();
        return res.status(200).json({ data: questionDetails});
    } else {
        return res.status(201).json({ data: "Something went wrong!"});
    }
});

router.post('/delete/:id', async (req, res) => {
    if (req.params.id != "undefined") {
        const questionDetails = await Question.deleteOne({_id: new mongodb.ObjectID(req.params.id)}).lean().exec();
        return res.status(200).json({ data: questionDetails});
    } else {
        return res.status(201).json({ data: "Something went wrong!"});
    }
});

module.exports = router;