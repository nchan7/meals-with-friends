require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const expressJWT = require('express-jwt');
const helmet = require('helmet'); //? Sets a bunch of headers to prevent hacking and scripting attacks
const RateLimit = require('express-rate-limit');

const app = express(); 

app.use(express.urlencoded({extended: false}));
app.use(express.json()); //? Just a configuration for the body parser. Both will result in information in req.body
app.use(helmet());

const loginLimiter = new RateLimit({
    windowMs: 5*60*1000,
    max: 3,
    delayMs: 0,
    message: 'Maximum login attempts exceeded!'
})
const signupLimiter = new RateLimit({
    windowMs: 60*60*1000,
    max: 3,
    delayMs: 0,
    message: 'Maximum accounts created. Please try again later.'
})

mongoose.connect('mongodb://localhost/jwtAuth', {useNewUrlParser: true});
const db = mongoose.connection; 
db.once('open', () => {
    console.log(`Connected to Mongo on ${db.host}:${db.port}`);
});
db.on('error', (err) => {
    console.log(`Database error:\n${err}`);
});

// app.use('/auth/login', loginLimiter); //! Commented out for testing
// app.use('/auth/signup', signupLimiter);

app.use('/auth', require('./routes/auth'));
app.use('/api', expressJWT({secret: process.env.JWT_SECRET}), require('./routes/api'));
//* Can include .unless to lock everything except certain verb: ".unless({method: 'POST'})"

app.listen(process.env.PORT, () => {
    console.log(`You're listening to port ${process.env.PORT}...`)
});
