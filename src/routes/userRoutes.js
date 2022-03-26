const express = require("express");
const sessions = require("../../data/sessions");
const users = require('../../data/users');
const { phoneValidator, nameValidator, emailValidator, passwordValidator } = require("../utils/validators");

const userRouter = express.Router();

userRouter.post(['/register'], (req, res, next) => {
    const { mobile, name } = req.body;
    if (phoneValidator(mobile).hasError) {
        res.status(400)
            .json({
                error: 'Invalid mobile.',
                message: phoneValidator(mobile).message
            });
        return;
    }
    const userSessionDetails = sessions.getUserSessions(mobile);
    const userWithGivenMobile = users.find(user => user.phone === mobile);
    if (!userWithGivenMobile) {
        req.session.stage = 0;
    } else if (userWithGivenMobile.hasCompletedRegistration) {
        req.session.stage = 3;
    } else if (userWithGivenMobile.hasEmailData) {
        req.session.stage = 2;
    } else {
        req.session.stage = 1;
    }
    // if (!userSessionDetails || !sessions.userHasSession(mobile, req.session.id)) {
    //     sessions.insertUserSession(mobile, req.session);
    // }
    if (req.session.stage === 0) {
        if (nameValidator(name).hasError) {
            res.status(400)
                .json({
                    error: 'Invalid name.',
                    message: nameValidator(name).message
                });
            return;
        }
        users.push({
            name: name.trim(),
            phone: mobile,
            hasEmailData: false,
            hasCompletedRegistration: false
        });
        req.session.stage++;
        res.status(201)
            .json({
                data: 'User Added!',
                message: 'User is added! Please provide email and password now.'
            });
        return;
    } else if (req.session.stage === 1) {
        const { email, password } = req.body;
        if (emailValidator(email).hasError) {
            res.status(400)
                .json({
                    error: 'Invalid Email.',
                    message: emailValidator(email).message
                });
            return;
        }
        if (passwordValidator(password).hasError) {
            res.status(400)
                .json({
                    error: 'Password invalid.',
                    message: passwordValidator(password).message
                });
            return;
        }
        for (const user of users) {
            if (user.phone === mobile) {
                user.email = email;
                user.password = password;
                user.hasEmailData = true;
            };
        }
        req.session.stage++;
        res.status(201)
            .json({
                data: 'User updated with email and password!',
                message: 'User updated with email and password. Please provide DOB, PAN, fatherName to complete with registration process.'
            });
        return;
    } else if (req.session.stage === 2) {
        const { dob, pan, fatherName } = req.body;
        if (!dob || !pan || !fatherName || isNaN(new Date(dob))) {
            res.status(400)
                .json({
                    error: 'Invalid data.',
                    message: 'Please check dob, pan, fatherName is vaild.'
                });
            return;
        }
        for (const user of users) {
            if (user.phone === mobile) {
                user.DOB = new Date(dob).toISOString();
                user.PAN = pan;
                user.fatherName = fatherName;
                user.hasCompletedRegistration = true;
            };
        }
        req.session.stage++;
        res.status(201)
            .json({
                data: 'User Registered!',
                message: 'complete with registration process.'
            });
        return;
    } else {
        res.status(400)
            .json({
                error: 'Mobile already taken!!',
                message: 'User is already registered with this mobile. Please try logging in.'
            });
        return;
    }
    next();
});

userRouter.post('/login', (req, res, next) => {
    const { mobile, password } = req.body;
    if (!mobile || !password) {
        res.status(400)
            .json({
                error: 'Mobile and Password are required for login',
                message: 'Please provide mobile and password for login.'
            });
        return;
    }

    const user = users.find(user => user.phone === mobile);

    if (!user) {
        res.status(404)
            .json({
                error: 'Not found!',
                message: 'Please check the mobile. No user registered with this mobile.'
            });
        return;
    }
    if(!user.hasCompletedRegistration) {
        res.status(403)
        .json({
            error: 'Not registered',
            message: 'You have not completed your registration. Please complete registration before logging in.'
        });
        return;
    }

    if (user.password !== password) {
        res.status(401)
            .json({
                error: 'Wrong Password.',
                message: 'Password does not match. Please check again.'
            });
        return;
    }
    const userSessionDetails = sessions.getUserSessions(mobile);
    const userWithGivenMobile = user;
    if (!userWithGivenMobile) {
        req.session.stage = 0;
    } else if (userWithGivenMobile.hasCompletedRegistration) {
        req.session.stage = 3;
    } else if (userWithGivenMobile.hasEmailData) {
        req.session.stage = 2;
    } else {
        req.session.stage = 1;
    }
    if (!userSessionDetails || !sessions.userHasSession(mobile, req.session.id)) {
        sessions.insertUserSession(mobile, req.session);
    }
    res.status(200)
        .json({
            data: 'Success!',
            message: 'Login successful.'
        });
});
module.exports = Object.freeze({ userRouter });