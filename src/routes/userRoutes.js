const express = require("express");
const users = require('../../data/users');
const { phoneValidator, nameValidator, emailValidator, passwordValidator } = require("../utils/validators");

const userRouter = express.Router();
// TODO: state validation
userRouter.post(['/register', '/register/step1'], (req, res, next) => {
    const { mobile, name } = req.body;
    if (phoneValidator(mobile).hasError) {
        res.status(400)
        .json({
            error: 'Invalid mobile.',
            message: phoneValidator(mobile).message
        });
        return;
    }
    if (nameValidator(name).hasError) {
        res.status(400)
        .json({
            error: 'Invalid name.',
            message: nameValidator(name).message
        });
        return;
    }
    const userWithGivenMobile = users.find(user => user.phone === mobile);
    if (userWithGivenMobile) {
        res.status(400)
        .json({
            error: 'Mobile already taken!!',
            message: 'User is already registered with this mobile. Please try logging in.'
        });
        return;
    }
    users.push({
        name: name.trim(),
        phone: mobile,
        hasEmailData: false,
        hasCompletedRegistration: false
    });
    res.status(201)
    .json({
        data: 'User added!',
        message: 'User Added. Please provide your email, password at route: /user/register/step2 to continue with registration process.'
    });
});

userRouter.post('/register/step2', (req, res, next) => {
    const { mobile, email, password } = req.body;
    if(!mobile || !users.find(user => user.phone === mobile)) {
        res.status(404)
        .json({
            error: 'Invalid mobile.',
            message: 'User not found with given mobile. Please check mobile number.'
        });
        return;
    }
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
    res.status(201)
    .json({
        data: 'User updated with email and password!',
        message: 'User updated with email and password. Please provide DOB, PAN, fatherName at route: /user/register/step3 to complete with registration process.'
    });
});

userRouter.post('/register/step3', (req, res, next) => {
    const { mobile, dob, pan, fatherName, password } = req.body;
    if(!mobile || !users.find(user => user.phone === mobile)) {
        res.status(404)
        .json({
            error: 'Invalid mobile.',
            message: 'User not found with given mobile. Please check mobile number.'
        });
        return;
    }
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
            user.PAN = password;
            user.fatherName = fatherName;
            user.hasCompletedRegistration = true;
        };
    }
    res.status(201)
    .json({
        data: 'User Registered!',
        message: 'complete with registration process.'
    });
});

userRouter.post('/login', (req, res, next) => {
    const { mobile, password } = req.body;

    if(!mobile || !password) {
        res.status(400)
        .json({
            error: 'Mobile and Password are required for login',
            message: 'Please provide mobile and password for login.'
        });
        return;
    }

    const user = users.find(user => user.phone === mobile);

    if(!user) {
        res.status(404)
        .json({
            error: 'Not found!',
            message: 'Please check the mobile. No user registered with this mobile.'
        });
        return;
    }

    if(user.password !== password) {
        res.status(401)
        .json({
            error: 'Wrong Password.',
            message: 'Password does not match. Please check again.'
        });
        return;
    }
    res.status(200)
    .json({
        data: 'Success!',
        message: 'Login successful.'
    });
});
module.exports = Object.freeze({ userRouter });