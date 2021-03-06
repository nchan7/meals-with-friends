import express from 'express';
const router = express.Router(); 
import mongoose from 'mongoose';
import axios from 'axios';

import User, {IUser} from '../models/user';
import Restaurant, {IRestaurant} from '../models/restaurant';
import Review, {IReview} from '../models/review';
import mapbox from '@mapbox/mapbox-sdk/services/geocoding';

// const geocodingClient = mapbox({accessToken: process.env.MAPBOX_PUBLIC_KEY});

router.use(express.urlencoded({extended: false}));


// router.get('/', (req, res) => {
//     res.json({type: 'success', message: 'You accessed the protected api routes'})
// });




// GET ALL reviews for a user
router.get('/', (req, res) => {
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


// POST review for a user and restaurant- 
router.post('/', (req, res) => {
    console.log("Hitting the POST new review route")
    console.log(req.body.api_id)
    console.log((<any>req).user._id)
    console.log(req.body.review)
    Restaurant.findOne({api_id: req.body.api_id}, function(err, restaurant: IRestaurant) {
        console.log(restaurant)
        User.findById((<any>req).user._id, function(err, user: IUser){
            console.log("We got the user", user)
            Review.create({
                restaurant_id: restaurant._id,
                user_id: user._id,
                user_name: user.name,
                review: req.body.review
            },
            function(err, review: IReview) {
                console.log("review created", review)
                user.reviews.push(review._id)
                user.save()
                restaurant.reviews.push(review._id)
                restaurant.save()
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
router.delete('/:id', (req, res) => {
    User.findById((<any>req).user._id).populate('reviews').exec(function(err, user: IUser) {
        let index = user.reviews.indexOf(req.params.id)
        user.reviews.splice(index,1)
        user.save()
        if (err) res.json(err);
        res.json({type: 'success', message: 'You deleted one review', user})
        Review.deleteOne({
            _id: req.params.id
        },
        function(err) {
            // user.reviews.pull(req.params.id);
            // user.save(function(err, user) {
            if (err) res.json(err);
                
        })
    })
})

export default router; 