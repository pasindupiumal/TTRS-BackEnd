const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    firstName: {
        type:String,
        required: true,
        minLength: 2,
        maxLength: 100
    },
    lastName: {
        type:String,
        required: true,
        minLength: 2,
        maxLength: 100
    },
    email:{
        type:String,
        required: true,
        minLength: 5,
        maxLength: 255,
        unique: true
    },
    password:{
        type:String,
        required: true,
        minLength: 5,
        maxLength: 255,
    },
    nic:{
        type:String,
        minLength: 10,
        maxLength: 15,
    }
});

const User = mongoose.model('User', UserSchema);

function validateUser(user){

    const userValidateSchema = {
        firstName: Joi.string().min(2).max(100).required(),
        lastName: Joi.string().min(2).max(100).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        nic: Joi.string().min(10).max(15)
    };

    return Joi.validate(user, userValidateSchema);
}

module.exports.User = User;
module.exports.validateUser = validateUser;