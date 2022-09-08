const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const User = require('../model/users.model.js');

router.get('/', async (req, res) => {
    const userDetails = await User.find({}).lean();
    res.status(200).json({data: userDetails});
});

router.post('/login', async (req, res) => {
    if(req && req.body) {
        if(req.body && req.body.email && req.body.password) {
            const existingUser = await User.findOne({email: req.body.email});
            if(existingUser && existingUser.password === req.body.password) {
                res.status(200).send({data: 'Account login successfully'});
            } else {
                res.status(200).send({data: 'Please check your email and password'});
            }
        } else {
            res.status(404).send({message: 'Please check your email and password'});
        }
    } else {
        res.status(404).send({message: 'Invalid request'});
    }
})

router.post('/signup', async (req, res) => {
    if(req && req.body) {
        if(req.body && req.body.email && req.body.password && req.body.first_name && req.body.last_name) {
            const existingUser = await User.find({email: req.body.email});
            if(existingUser) {
                return res.status(200).send({data: 'Account already exists with the same Email'});
            }
            const newUser = await User.create(req.body);
            if(newUser && newUser._id) {
                res.status(200).send({data: 'Account created successfully'});
            } else {
                res.status(404).send({message: 'Invalid request'});
            }
        } else {
            res.status(404).send({message: 'Invalid request'});
        }
    } else {
        res.status(404).send({message: 'Invalid request'});
    }
});

module.exports = router;