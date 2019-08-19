import express, {Request, Response} from 'express';
const router = express.Router(); 
import mongoose from 'mongoose';
import axios from 'axios';

import User, {IUser} from '../models/user';
import Restaurant from '../models/restaurant';
import Review from '../models/review';
import mapbox from '@mapbox/mapbox-sdk/services/geocoding';

// const geocodingClient = mapbox({accessToken: process.env.MAPBOX_PUBLIC_KEY});

router.use(express.urlencoded({extended: false}));


// router.get('/', (req, res) => {
//     res.json({type: 'success', message: 'You accessed the protected api routes'})
// });




// GET ALL reviews for a user
router.get('/', (req: Request, res: Response) => {
    User.findById((<any>req).user._id).populate('reviews').exec( (err,user: IUser) => {
        console.log(user)
        if (err) res.json(err)
        res.json(user.reviews)
    })
});

// GET ONE review for a user
router.get('/:id', (req, res) => {
    Review.findById(req.params.id, (err,review) => {
        if (err) res.json(err)
        res.json(review)
    })
});


// POST review for a user - 
router.post('/', (req, res) => {
    console.log("Hitting the POST new trip route");
    console.log(req.body)
    console.log((<any>req).user._id)
    // console.log("locStart", locStart)
    User.findById((<any>req).user._id, function(err, user: IUser){
        console.log("We got the user")
        Review.create({
            review: req.body.review,
        },
        function(err, review) {
            console.log("review created", review)
            user.reviews.push(review)
            user.save(function(err, user) {
                // console.log('this is another user test: ', user)
                if (err) console.log(err)
                res.json(user) 
            })
        })
    })
});

// UPDATE review for a user
router.put('/:id', (req, res) => {
    console.log("Hitting the PUT review route");
    Review.findByIdAndUpdate(req.params.id, 
        {
            review: req.body.review
        },{new: true}, 
        function(err, review) {
            if (err) res.json(err)
            res.json({review})
        })
})
    


// DELETE review for a user
// Pull from user and then remove from Reviews 
// router.delete('/:id', (req, res) => {
//     User.findById((<any>req).user._id).populate('reviews').exec(function(err, user: IUser) {
//         user.reviews.pull(req.params.id);
//             user.save(function(err, user) {
//                 if (err) res.json(err);
//                 res.json({type: 'success', message: 'You deleted one trip', user})
//         Review.findOneAndRemove({
//             _id: req.params.id
//         },
//         function(err, review) {
//             // todo after delete trip, pull the trip id from the user as well
//             user.reviews.pull(req.params.id);
//             user.save(function(err, user) {
//                 if (err) res.json(err);
//                 res.json({type: 'success', message: 'You deleted one trip', user})
                
//             })
//         })
//     })
// })

export default router; 