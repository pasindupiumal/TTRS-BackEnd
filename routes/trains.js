const express = require('express');
const admin = require('../middleware/admin');
const authMiddleware = require('../middleware/auth');
const {Train, validateTrain} = require('../models/trains');
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {

    if(Object.keys(req.query).length === 0){
        console.log('No query parameters set. Returning all train shedules');
        const trains = await Train.find().sort('origin');
        res.send(trains);
    }
    else if(Object.keys(req.query).length === 2 && Object.keys(req.query)[0] === 'origin' && Object.keys(req.query)[1] === 'destination' && (req.query.origin==='' || req.query.destination==='')){
        console.log('Query parameters set but empty:{origin , destination}');
        const trains = await Train.find().sort('origin');
        res.send(trains);
    }
    else if(Object.keys(req.query).length === 2 && Object.keys(req.query)[0] === 'origin' && Object.keys(req.query)[1] === 'destination'){
        console.log('Query parameters set:{origin , destination}');
        const trains = await Train.find({origin: req.query.origin, destination: req.query.destination});
        res.send(trains);
    }
    else{
        console.log('400 - Bad Request');
        return res.status(400).send('Invalid query parameters. {origin=&destination=}');
    }
});

router.get('/:id', [authMiddleware, admin], async (req, res) => {

    const train = await Train.findById(req.params.id);

    if(!train){
        return res.status(404).send('Train information with the given id does not exist');
    }

    console.log('Train shedule found and sent');
    res.send(train);
    
});

router.post('/', [authMiddleware, admin], (req, res) => {

    const {error} = validateTrain(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    console.log('New train shedule successfully added to Mongo DB');
    Train.create(req.body).then((train) => res.send(train)).catch((err) => res.send(err.message));
    
});

router.put('/:id', [authMiddleware, admin], (req, res) => {
    
    const {error} = validateTrain(req.body);

    if(error) return res.status(400).send(error.details[0].message);

    Train.findByIdAndUpdate(req.params.id, req.body).then(() => {
        Train.findOne({_id:req.params.id}).then((train) => res.send(train)).catch((err) => res.send(err.message));
    }).catch((err) => res.send(err.message));

});

router.delete('/:id', [authMiddleware, admin], async (req, res) => {

    const train = await Train.findByIdAndDelete(req.params.id);

    if(!train) return res.status(404).send('Train shedule with the given id does not exist');

    res.send(train);
});

module.exports = router;