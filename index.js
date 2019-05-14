const express = require('express');
const trains = require('./routes/trains');
const users = require('./routes/users');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT  || 3000;

//Connect to mongoDB
mongoose.connect('mongodb://localhost/TTRS', {useNewUrlParser:true}).then(() => {
    console.log('Successfully connected to MongoDB');
}).catch((err) => {
    console.log('Could not connect to MongoDB');
    console.log(err);
})

//User the middleware
app.use(bodyParser.json());

app.use('/api/trains', trains);
app.use('/api/users/', users);



app.listen(port, () => {
    console.log('Listening on port ' + port);
})

