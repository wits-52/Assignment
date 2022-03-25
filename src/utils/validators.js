const phoneValidator = (phone) => {
    let hasError = false;
    let message = 'Success';
    if (typeof phone !== 'string' || phone.length !== 10) {
        hasError = true;
        message = 'Invalid phone. Provide valid string value.';
    }
    if (!hasError && !phone.match(/^[1-9][0-9]*$/)) {
        hasError = true;
        message = 'Invalid phone. Allowed Format: String containing numbers only, starting with non-zero digit';
    }
    return {
        hasError, message
    };
}

const nameValidator = (name) => {
    let hasError = false;
    let message = 'Success';
    if (typeof name !== 'string' || name.length === 0) {
        hasError = true;
        message = 'Invalid name. Provide valid non-empty string.';
    }
    if (!hasError && !name.match(/^[a-zA-Z]+[ a-zA-Z]*$/)) {
        hasError = true;
        message = 'Invalid name. Allowed pattern: space separated words.';
    }
    return {
        hasError, message
    };
}
const emailValidator = (email) => {
    let hasError = false;
    let message = 'Success!';
    if (typeof email !== 'string' || email.length === 0) {
        hasError = true;
        message = 'Invalid email. Provide valid non-empty string.';
    }
    if (!hasError && !email.match(/^[a-zA-Z0-9_]+[a-zA-Z0-9_.]*[a-zA-Z0-9_]*[@][a-zA-Z][a-zA-Z]+[.][a-zA-Z][a-zA-Z]+$/)) {
        hasError = true;
        message = 'Invalid email. Allowed Pattern: should have @, in local address [_ , .] are allowed. ';
    }
    return {
        hasError,
        message
    };
}
const passwordValidator = (pwd) => {
    let hasError = false;
    let message = 'Success!';
    if (typeof pwd !== 'string' || pwd.length < 8) {
        hasError = true;
        message = 'Password should have minimum length of 8.'
    }
    return {
        hasError,
        message
    };
}
module.exports = Object.freeze({
    phoneValidator,
    nameValidator,
    emailValidator,
    passwordValidator
});