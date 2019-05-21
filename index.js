const express = require('express');
const config = require('config');
const trains = require('./routes/trains');
const users = require('./routes/users');
const auth = require('./routes/auth');
const payment = require('./routes/payment');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
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

app.use(cors({
    //origin: 'http://localhost:3001'
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'x-auth-token'
  }));

//User the middleware 
app.use(bodyParser.json());

app.use('/api/trains', trains);
app.use('/api/users/', users);
app.use('/api/auth', auth);
app.use('/api/payment', payment);



app.listen(port, () => {
    console.log('Listening on port ' + port);
})

