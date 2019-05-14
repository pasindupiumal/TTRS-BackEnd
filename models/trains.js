const mongoose = require('mongoose');
const Joi = require('joi');
const Schema = mongoose.Schema;

const TrainSchema = new Schema({

    origin:{
        type:String,
        required:[true, 'Origin is required']
    },

    destination: {
        type:String, 
        required:[true, 'Destination is required']
    },
    trainName: {
        type:String,
        required:[true, 'Train name is required']
    },
    availableDays: {
        type:[String],
        required:[true, 'Available days are required']
    },
    departureTime: {
        type:Date,
        default:Date.now
    },
    arrivalTime: {
        type:Date,
        default:Date.now
    },
    trainType:{
        type:String,
        required:[true, 'Train type is required']
    },
    price: {
        type:Number,
        default:0
    }
});

const Train = mongoose.model('Train', TrainSchema);

function validateTrain(train){

    const trainValidationSchema = {
        origin: Joi.string().required(),
        destination: Joi.string().required(),
        trainName: Joi.string().required(),
        availableDays: Joi.array().items(Joi.string()).required(),
        departureTime: Joi.date(),
        arrivalTime: Joi.date(),
        trainType: Joi.string().required(),
        price: Joi.number().required()
    }

    return Joi.validate(train, trainValidationSchema);
}

module.exports.Train = Train;
module.exports.validateTrain = validateTrain;