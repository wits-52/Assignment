const express = require('express');
const { userRouter } = require('./routes/userRoutes');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/user', userRouter);

module.exports = Object.freeze({ app });