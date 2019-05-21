const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

const creditCardSchema = new Schema({

    cardNumber: {
        type:String
    },

    expireDate:{
        type:String
    },
    csv:{
        type:String
    }
});

const mobileSchema = new Schema({
    mobileNumber: {
        type:String,
    },
    pin:{
        type:String
    }
})

const creditCard = mongoose.model('CreditCard', creditCardSchema);
const mobilePayment = mongoose.model('MobilePayment', mobileSchema);

function validateCreditCard(creditCard){

    const validateCreditCardSchema = {
        cardNumber: Joi.string().required(),
        expireDate: Joi.string().required(),
        csv: Joi.string().required()
    }

    return Joi.validate(creditCard, validateCreditCardSchema);
}

function validateMobilePayment(mp){

    const validateMobilePaymentSchema = {
        mobileNumber: Joi.string().required(),
        pin: Joi.string().required(),
    }

    return Joi.validate(mobilePayment, validateMobilePaymentSchema);
}
module.exports.creditCard = creditCard;
module.exports.validateCreditCard = validateCreditCard;
module.exports.mobilePayment = mobilePayment;
module.exports.validateMobilePayment = validateMobilePayment;