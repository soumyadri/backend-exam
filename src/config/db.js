const mongoose = require('mongoose');

const connect = () => {
    return mongoose.connect('mongodb+srv://soumyadri:soumyadri@webexamination.gscdxjc.mongodb.net/Examination')
};

module.exports = connect;