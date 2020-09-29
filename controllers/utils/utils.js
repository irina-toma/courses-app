jsonPayload = (msg, success=true) => {
    return {message: msg, success}
}

success = (params, msg='OK') => {
    return {message: msg, success: true, data: params}
}

error = (msg='Error') => {
    return {message: msg, success: false};
}

MISSING_PARAMS = error('Missing parameters!');
USER_EXISTS = error('Please select a different username or email!');
GENERAL_ERR = error('Error processing request.');
REGISTER_OK = jsonPayload('Successful registration.');
USER_NOT_EXISTS = error('Username does not exist.');
LOGIN_OK = jsonPayload('Successful login.');
WRONG_PASSWD = error('Wrong password.');
ERR_GET_USERS = error('Error loading users');
UPDATE_OK = jsonPayload('Successful update.');
WRONG_PARAMS = error('Wrong parameters.');
DELETE_OK = jsonPayload('Successful delete.');

module.exports = {
    success, error, MISSING_PARAMS, USER_EXISTS, GENERAL_ERR, REGISTER_OK,
    USER_NOT_EXISTS, LOGIN_OK, WRONG_PASSWD, ERR_GET_USERS, UPDATE_OK, 
    WRONG_PARAMS, DELETE_OK
};