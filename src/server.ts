import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import mongoose from 'mongoose';
import expressJWT from 'express-jwt';
import helmet from 'helmet';
// import RateLimit from 'express-rate-limit';

const app = express(); 

app.use(express.urlencoded({extended: false}));
app.use(express.json()); //? Just a configuration for the body parser. Both will result in information in req.body
app.use(helmet());
app.use(express.static(__dirname + '/../client/build'))

// const loginLimiter = new RateLimit({
//     windowMs: 5*60*1000,
//     max: 3,
//     delayMs: 0,
//     message: 'Maximum login attempts exceeded!'
// })
// const signupLimiter = new RateLimit({
//     windowMs: 60*60*1000,
//     max: 3,
//     delayMs: 0,
//     message: 'Maximum accounts created. Please try again later.'
// })

mongoose.connect(process.env.MONGODB_URI as string, {useNewUrlParser: true});
const db = mongoose.connection; 
db.once('open', () => {
    console.log(`Connected to Mongo on probably the right port...🚢`);
});
db.on('error', (err) => {
    console.log(`Database error:\n${err}`);
});

// app.use('/auth/login', loginLimiter); //! Commented out for testing
// app.use('/auth/signup', signupLimiter);

import authRouter from './routes/auth';
app.use('/auth', authRouter);

import restaurantRouter from './routes/restaurant';
// app.use('/restaurants', expressJWT({secret: process.env.JWT_SECRET}).unless({method: 'POST'}), restaurantRouter);
app.use('/restaurants', restaurantRouter);
//* Can include .unless to lock everything except certain verb: ".unless({method: 'POST'})"

import reviewRouter from './routes/review';
// app.use('/reviews', reviewRouter);
app.use('/reviews', expressJWT({secret: process.env.JWT_SECRET}), reviewRouter);

app.get("*", (req, res) => {
    res.sendFile("index.html")
})

app.listen(process.env.PORT, () => {
    console.log(`You're listening to port ${process.env.PORT}...`)
});
