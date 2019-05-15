const express = require('express');
const config = require('config');
const trains = require('./routes/trains');
const users = require('./routes/users');
const auth = require('./routes/auth');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT  || 3000;

//If the jwtPrivateKey is not set, exit the application.
if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPirvateKey is not defined');
    process.exit(1);
}
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
app.use('/api/auth', auth);



app.listen(port, () => {
    console.log('Listening on port ' + port);
})

