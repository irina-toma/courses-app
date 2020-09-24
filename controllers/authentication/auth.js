const express = require('express');
const bcrypt = require('bcrypt');

const utils = require('../utils/utils.js');
const { pool, User } = require('../../models');
const { generateToken } = require('../security/jwt.js');

const router = express.Router();


router.get('/login', (req, resp) => {
    resp.render('login');
});

router.post('/register', async (req, resp) => {
    const params = req.body;
    if (params.hasOwnProperty('name') && params.hasOwnProperty('email') &&
        params.hasOwnProperty('username') && params.hasOwnProperty('password')) {

        const name = params.username;
        const email = params.email;
        const username = params.username;
        const password = params.password;

        let user = new User(name, email, password, username, 'student');

        try {
            let result = await user.save();
            console.log(result);
            resp.render('login');
        }
        catch (error) {
            console.log(error);
            resp.render('register', error);
        } 
    } else {
        console.log(utils.MISSING_PARAMS);
        resp.render('register', utils.MISSING_PARAMS);
    }
})

router.post('/login', (req, resp) => {
    const params = req.body;

    if (params.hasOwnProperty('username') && params.hasOwnProperty('password')) {
        const username = params.username;
        const password = params.password;

        //validate parameters
        //1. username should be text
        //2. username should not contain special characters
        //3. username.length between x and y

        const checkUserStm = {
            text: 'SELECT * FROM public.users WHERE username=$1',
            values: [username]
        }
        pool.query(checkUserStm, (queryErr, queryResp) => {
            if (queryErr) {
                console.log(utils.GENERAL_ERR);
                console.log(queryErr);
                resp.render('login', utils.GENERAL_ERR);
                // resp.status(403).send(utils.GENERAL_ERR);
                return;
            }
            if (queryResp.rows.length == 0) {
                resp.render('login', utils.USER_NOT_EXISTS);
                console.log(utils.USER_NOT_EXISTS);
                // resp.status(404).send(utils.USER_NOT_EXISTS);
                return;
            }

            const currentUser = queryResp.rows[0];

            bcrypt.compare(password, currentUser.password, async (cryptErr, cryptResp) => {
                if (cryptResp) {
                    //success
                    let token = await generateToken({
                        userId: currentUser.id,
                        userRole: 'student' //user.role
                    });
                    resp.render('index', { token: token });
                    console.log(token);
                    // resp.send(utils.success(token));
                } else {
                    // resp.status(403).send(utils.WRONG_PASSWD);
                    console.log(utils.WRONG_PASSWD);
                    resp.render('login', utils.WRONG_PASSWD);
                }
            })
        });
    } else {
        // resp.status(403).send(utils.MISSING_PARAMS);
        console.log(utils.MISSING_PARAMS);
        resp.render('./components/login', utils.MISSING_PARAMS);

    }
})


module.exports = router;