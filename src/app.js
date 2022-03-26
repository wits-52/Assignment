const express = require('express');
const session = require('express-session');
const { userRouter } = require('./routes/userRoutes');
const app = express();
const config = require('../config');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: config.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));

app.use('/user', userRouter);

module.exports = Object.freeze({ app });