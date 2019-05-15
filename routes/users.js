const _ = require('lodash');
const bcrypt = require('bcrypt'); 
const express = require('express');
const {User, validateUser} = require('../models/users');
const router = express.Router();

router.post('/', async (req, res) => {
    
    const {error} = validateUser(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    //Make sure the user in not already registered
    let user = await User.findOne({email: req.body.email});

    if(user) return res.status(400).send('User already registered');

    //If the user is unregistered save the user
    user = new User(_.pick(req.body, ['firstName', 'lastName', 'email', 'password', 'nic', 'isAdmin']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    user.save().then((user) => {
        console.log('New user successfully added to MongoDB');
        res.send(_.pick(user, ['_id', 'firstName', 'lastName', 'email']));
    }).catch((err) => res.send(err.message));
    
});

module.exports = router;