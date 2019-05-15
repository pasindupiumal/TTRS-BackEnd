const _ = require('lodash');
const bcrypt = require('bcrypt'); 
const authMiddleware = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const {User, validateUser} = require('../models/users');
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {

    if(Object.keys(req.query).length === 0){
        console.log('No query parameters set. Returning all users');
        const users = await User.find().sort('firstName');

        Object.keys(users).forEach(function(key){
            users[key] = _.pick(users[key], ['firstName', 'lastName', 'email', 'mobileNumber', 'isAdmin']);
        })

        res.send(users);
    }
    else if(Object.keys(req.query).length === 2 && Object.keys(req.query)[0] === 'firstName' && Object.keys(req.query)[1] === 'lastName'){
        console.log('Query parameters set:{firstName , lastName}');
        const users = await User.find({firstName: req.query.firstName , lastName: req.query.lastName});
        Object.keys(users).forEach(function(key){
            users[key] = _.pick(users[key], ['firstName', 'lastName', 'email', 'mobileNumber', 'isAdmin']);
        })

        res.send(users);
    }
    else if(Object.keys(req.query).length === 1 && Object.keys(req.query)[0] === 'email'){
        console.log('Query parameters set:{email}');
        const users = await User.find({email: req.query.email});

        Object.keys(users).forEach(function(key){
            users[key] = _.pick(users[key], ['firstName', 'lastName', 'email', 'mobileNumber', 'isAdmin']);
        })

        res.send(users);
    }
    else{
        console.log('400 - Bad Request');
        return res.status(400).send('Invalid query parameters. {origin=&destination=}');
    }
});

router.get('/:id', [authMiddleware], async (req, res) => {

    let user = await User.findById(req.params.id);

    if(!user){
        return res.status(404).send('User with the given id does not exist');
    }

    user = _.pick(user, ['firstName', 'lastName', 'email', 'mobileNumber', 'isAdmin']);
    console.log('User found and sent');
    res.send(user);
    
});

//Register new users
router.post('/', async (req, res) => {
    
    const {error} = validateUser(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    //Make sure the user in not already registered
    let user = await User.findOne({email: req.body.email});

    if(user) return res.status(400).send('User already registered');

    //If the user is unregistered save the user
    user = new User(_.pick(req.body, ['firstName', 'lastName', 'email', 'password', 'nic', 'isAdmin', 'mobileNumber']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    user.save().then((user) => {
        console.log('New user successfully added to MongoDB');
        res.send(_.pick(user, ['_id', 'firstName', 'lastName', 'email']));
    }).catch((err) => res.send(err.message));
    
});

router.delete('/:id', authMiddleware, async (req, res) => {

    let user = await User.findByIdAndDelete(req.params.id);

    if(!user) return res.status(404).send('User with the given id does not exist');
    user = _.pick(user, ['firstName', 'lastName', 'email', 'mobileNumber', 'isAdmin']);
    res.send(user);
});

module.exports = router;