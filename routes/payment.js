const _ = require('lodash');
const bcrypt = require('bcrypt'); 
const express = require('express');
const {creditCard, validateCreditCard, mobilePayment, validateMobilePayment} = require('../models/payment');
const router = express.Router();

router.post('/creditcard', async (req, res) => {

    const {error} = validateCreditCard(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    res.send('Credit Card Payment Successful');


});


router.post('/mobilePayment', async (req, res) => {

    const {error} = validateMobilePayment(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    res.send('Mobile Payment Successful');


});





module.exports = router;