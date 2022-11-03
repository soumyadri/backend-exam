const express = require('express');
const app = express();

const cors = require("cors");
app.use(cors());

const connect = require('./config/db');

const userController = require('./controller/users.controller');

app.use(express.json());
app.use('/user', userController);

const start = async () => {
    await connect();

    app.listen(8000, () => {
        console.log('Server started on 8000');
    });
}

module.exports = start;