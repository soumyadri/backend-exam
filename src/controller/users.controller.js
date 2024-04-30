const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(express.json());

const User = require('../model/users.model.js');

router.get('/', async (req, res) => {
    try {
        const userDetails = await User.find({}, { password: 0, gender: 0, __v: 0, _id: 0 }).lean();
        res.status(200).json({ data: userDetails });
    } catch (err) {
        res.status(500).send({ message: 'Internal server error' });
    }
});

router.get('/email', async (req, res) => {
    try {
        const { email } = req.query;

        const userDetails = await User.findOne({ email }, { password: 0, gender: 0, __v: 0, _id: 0 }).lean();
        if (!userDetails) {
            return res.status(400).send({ message: 'There is no such users' });
        }

        res.status(200).json({ data: userDetails });
    } catch (err) {
        res.status(500).send({ message: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ message: 'Please provide both email and password' });
        }

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatch) {
            return res.status(401).send({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Return token and user information
        res.status(200).send({
            token,
            user: {
                first_name: existingUser.first_name,
                last_name: existingUser.last_name,
                email: existingUser.email,
                profilePic: existingUser.profilePic || '',
                role: existingUser.role || "student",
            },
            message: 'Login successful'
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

router.post('/signup', async (req, res) => {
    try {
        const { email, password, first_name, last_name, role, gender, age } = req.body;
        if (!email || !password || !first_name || !last_name || !role || !gender || !age) {
            return res.status(400).send({ message: 'Please provide all required fields' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send({ message: 'Account already exists with the same email' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user with hashed password
        const newUser = await User.create({
            email,
            password: hashedPassword,
            first_name,
            last_name,
            role,
            gender,
            age,
        });

        if (newUser && newUser._id) {
            res.status(200).send({ message: 'Account created successfully' });
        } else {
            res.status(500).send({ message: 'Internal server error' });
        }
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

module.exports = router;