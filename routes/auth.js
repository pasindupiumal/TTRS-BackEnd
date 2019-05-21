const _ = require('lodash');
const bcrypt = require('bcrypt'); 
const express = require('express');
const {User, validateUserForLogin} = require('../models/users');
const router = express.Router();

//Check whether a given user is registered
router.post('/', async (req, res) => {
    
    const {error} = validateUserForLogin(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    //Make sure the user in not already registered
    let user = await User.findOne({email: req.body.email});

    if(!user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if(!validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();

    res.send(token);

});

//Check whether a given NIC number belongs to a government worker
router.post('/nic', async (req, res) => {
    
    if(req.body.nic.length === 10)
    {
        res.send('Government Employee');
    }
    else{
        res.send('Not a Government Employee');
    }
});

module.exports = router;