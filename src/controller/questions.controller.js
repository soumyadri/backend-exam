const express = require('express');
const router = express.Router();
var mongodb = require('mongodb');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const User = require('../model/users.model.js');
const Question = require('../model/exam.model.js');

router.get('/all', async (req, res) => {
    try {
        // if (!req.headers.authorization) {
        //     return res.status(401).send({ message: 'Invalid Token' });
        // };
        // const token = req.headers.authorization.split(' ')[1];
        // const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // const { userId } = decodedToken;
        // const userDetails = await User.findById(userId);
        // if (!userDetails) {
        //     return res.status(401).send({ message: 'Invalid Token' });
        // };

        let projection = { __v: 0 };
        // if (userDetails.role === 'student') {
        //     projection.answer = 0;
        // }

        const questionDetails = await Question.find({}, projection).lean();
        res.status(200).json({ data: questionDetails });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ data: "Internal server error" });
    }
});

router.get('/all/:id', async (req, res) => {
    try {
        // if (!req.headers.authorization) {
        //     return res.status(401).send({ message: 'Invalid Token' });
        // };
        // const token = req.headers.authorization.split(' ')[1];
        // const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // const { userId } = decodedToken;
        // const userDetails = await User.findById(userId);
        // if (!userDetails) {
        //     return res.status(401).send({ message: 'Invalid Token' });
        // };

        if (req.params.id == "javascript" || req.params.id == "html" || req.params.id == "css") {
            let projection = { __v: 0, _id: 0 };

            // if (userDetails.role === 'student') {
            //     projection.answer = 0;
            // };

            const questionDetails = await Question.find({ subject: req.params.id }).lean();
            return res.status(200).json({ data: questionDetails });
        } else {
            return res.status(201).json({ data: "Something went wrong" });
        }
    } catch (err) {
        return res.status(500).json({ data: "Internal server error" });
    }
});

router.post('/add', async (req, res) => {
    try {
        if (req && req.body && req.body.question && req.body.subject && req.body.optionA && req.body.optionB && req.body.optionC && req.body.optionD && req.body.answer) {
            const newQuestion = await Question.create(req.body);
            return res.status(200).json({ data: "Question Added Successfully" });
        } else {
            return res.status(201).json({ data: "Something went wrong!" });
        }
    } catch (err) {
        return res.status(500).json({ data: "Internal server error" });
    }
});

router.post('/checkResult', async (req, res) => {
    try {
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
            if (calculateMarks >= 4) {
                status = 1;
            }
            return res.status(200).json({ data: { marks: calculateMarks, status: status, right: questionCorrect, wrong: questionWrong } });
        } else {
            if (req && Object.keys(req.body).length == 0) {
                return res.status(200).json({ data: { marks: 0, status: 0 } });
            }
            return res.status(201).json({ data: "Something went wrong!" });
        }
    } catch (err) {
        return res.status(500).json({ data: "Internal server error" });
    }
});

router.post('/edit/:id', async (req, res) => {
    try {
        if (req.params.id != "undefined" && req && req.body && req.body.question && req.body.subject && req.body.optionA && req.body.optionB && req.body.optionC && req.body.optionD && req.body.answer) {
            const questionDetails = await Question.updateOne({ "id": req.params.id }, { $set: req?.body }).lean().exec();
            return res.status(200).json({ data: questionDetails });
        } else {
            return res.status(201).json({ data: "Something went wrong!" });
        }
    } catch (err) {
        return res.status(500).json({ data: "Internal server error " });
    }
});

router.post('/delete/:id', async (req, res) => {
    try {
        if (req.params.id != "undefined") {
            const questionDetails = await Question.deleteOne({ _id: new mongodb.ObjectID(req.params.id) }).lean().exec();
            return res.status(200).json({ data: questionDetails });
        } else {
            return res.status(201).json({ data: "Something went wrong!" });
        }
    } catch (err) {
        return res.status(500).json({ data: "Internal server error" });
    }
});

module.exports = router;