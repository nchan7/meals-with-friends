import express from 'express';
const router = express.Router(); 
import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config()

import User, {IUser} from '../models/user';
import Restaurant, {IRestaurant} from '../models/restaurant';
import Review from '../models/review';
import mapbox from '@mapbox/mapbox-sdk/services/geocoding';

const geocodingClient = mapbox({accessToken: process.env.MAPBOX_PUBLIC_KEY});

router.use(express.urlencoded({extended: false}));

// POST search results and GET ALL restaurants from Zomato API 
router.post('/search', (req, res) => {
    let location = req.body.search
    geocodingClient.forwardGeocode({
      query: location
      }).send().then( function(response) {   
          var lat = response.body.features[0].center[1];
          var lon = response.body.features[0].center[0];
          console.log(lat)
          console.log(lon)
          let zomatoUrl = `https://developers.zomato.com/api/v2.1/search?lat=${lat}&lon=${lon}`
          let config = {
            headers: {
              'Accept': 'application/json',
              'user-key': process.env.ZOMATO_KEY
            }
          }
          axios.get(zomatoUrl, config).then(results => {
            console.log('Getting my API')
            console.log(results.data.restaurants)
            res.json(results.data.restaurants)
          }).catch(err => {
            console.log(err)
          })
            // res.json({type: 'success', message: 'You accessed the protected api routes'})
      });
});


// POST restaurant to database
router.post('/', (req, res) => {
  Restaurant.findOne({api_id: req.body.api_id}, function(err, result) {
    console.log("found it", result)
    if (!result) {
      Restaurant.create({
        api_id: req.body.api_id,
        name: req.body.name,
      },
      function(err, restaurant: IRestaurant) {
          console.log("restaurant created", restaurant)
          restaurant.save()
          res.json(restaurant) 
      })
    } else {
      console.log('Already in database')
    }
  })
})


// GET ALL reviews for a restaurant
router.get('/reviews/:id', (req, res) => {
  Restaurant.findOne({api_id: req.params.id}).populate('reviews').exec( (err,restaurant: IRestaurant)  => {
    console.log(restaurant)  
    if (err) res.json(err)
    res.json(restaurant.reviews)
  })
})


router.get('/:id', (req, res) => {
  let zomatoUrl = `https://developers.zomato.com/api/v2.1/restaurant?res_id=${req.params.id}`
  let config = {
    headers: {
      'Accept': 'application/json',
      'user-key': process.env.ZOMATO_KEY
    }
  }
  axios.get(zomatoUrl, config).then(results => {
    console.log('Getting my API')
    console.log(results.data)
    res.json(results.data)
  }).catch(err => {
    console.log(err)
  })
})

// // // GET ALL reviews for a restaurant
// // router.get('/', (req, res) => {
// //     Restaurant.findById(req.user._id).populate('reviews').exec( (err,user) => {
// //         console.log(user)
// //         if (err) res.json(err)
// //         res.json(user.reviews)
// //     })
// // });




//     // send an object with two keys with a res.json...

    



// });


// // UPDATE trip for a user
// router.put('/:id', (req, res) => {
//     console.log("Hitting the PUT new trip route");
//     let locStart = req.body.zipStart; 
//     console.log("PUT locStart", locStart)
//     geocodingClient.forwardGeocode({
//     query: locStart
//     }).send().then( function(response) {
//         console.log("We got the PUT start lat long")
//         var latStartFromZip = response.body.features[0].center[1];
//         var longStartFromZip = response.body.features[0].center[0];

//         let locDest = req.body.zipDest;
//         console.log('PUT locDest', locDest)
//         geocodingClient.forwardGeocode({
//             query: locDest
//         }).send().then( function(response) {
//             console.log("PUT We got the return lat long")
//             var latDestFromZip = response.body.features[0].center[1];
//             var longDestFromZip = response.body.features[0].center[0];
        
    
        
//         Trip.findByIdAndUpdate(req.params.id, 
//             {
//                 tripName: req.body.tripName,
//                 zipStart: req.body.zipStart,
//                 latStart: latStartFromZip,
//                 longStart: longStartFromZip,
//                 startTime: req.body.startTime,
//                 travelTime: req.body.travelTime,
//                 zipDest: req.body.zipDest,
//                 latDest: latDestFromZip,
//                 longDest: longDestFromZip,
//                 returnTime: req.body.returnTime,
//                 returnTravelTime: req.body.returnTravelTime
//             },{new: true}, 
//             function(err, trip) {
//                     if (err) res.json(err)
//                     res.json({trip})
//             })
//         })
//     })
// })

// // DELETE trip for a user
// router.delete('/:id', (req, res) => {
//     User.findById(req.user._id).populate('trips').exec(function(err, user) {
//         Trip.findOneAndRemove({
//             _id: req.params.id
//         },
//         function(err) {
//             // todo after delete trip, pull the trip id from the user as well
//             user.trips.pull(req.params.id);
//             user.save(function(err, user) {
//                 if (err) res.json(err);
//                 res.json({type: 'success', message: 'You deleted one trip', user})
                
//             })
//         })
//     })
// })

export default router; 