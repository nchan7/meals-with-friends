import express from 'express';
const router = express.Router(); 
import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config()

import User, {IUser} from '../models/user';
import Restaurant from '../models/restaurant';
import Review from '../models/review';
import mapbox from '@mapbox/mapbox-sdk/services/geocoding';

const geocodingClient = mapbox({accessToken: process.env.MAPBOX_PUBLIC_KEY});

router.use(express.urlencoded({extended: false}));

// POST search results and GET ALL restaurants from Zomato API 
router.post('/', (req, res) => {
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


// // // GET ALL reviews for a restaurant
// // router.get('/', (req, res) => {
// //     Restaurant.findById(req.user._id).populate('reviews').exec( (err,user) => {
// //         console.log(user)
// //         if (err) res.json(err)
// //         res.json(user.reviews)
// //     })
// // });

// // GET ALL reviews for a restaurant
// router.get('/:id', (req, res) => {
//     Review.findById(req.params.id, (err,review) => {
//         if (err) res.json(err)
//         // res.json(trip)
//         // console.log(trip)
//         // console.log(req.params.id)
//         let zomatoUrl = `https://api.darksky.net/forecast/${process.env.DARK_SKY_API}/${trip.latStart},${trip.longStart}`
//         // console.log('Almost at the axios call')
//         axios.get(zomatoUrl).then(results => {
//             console.log('Im in the axios call', results)
//             res.json({results})
//         }).catch(err => {
//             res.send(err)
//         })
//     })

//     // send an object with two keys with a res.json...

    



// });


// // POST trip for a user - TESTING MAPBOX CONVERSION of zip to lat/long
// router.post('/', (req, res) => {
//     console.log(req.body)
//     console.log(req.user._id)
//     // console.log("Hitting the POST new trip route");
//     let locStart = req.body.zipStart; 
//     // console.log("locStart", locStart)
//     geocodingClient.forwardGeocode({
//     query: locStart
//     }).send().then( function(response) {
//         var latStartFromZip = response.body.features[0].center[1];
//         var longStartFromZip = response.body.features[0].center[0];
//         // console.log("We got the start lat long")

//         let locDest = req.body.zipDest;
//         console.log('locDest', locDest)
//         geocodingClient.forwardGeocode({
//             query: locDest
//         }).send().then( function(response) {
//             // console.log("We got the return lat long")
//             var latDestFromZip = response.body.features[0].center[1];
//             var longDestFromZip = response.body.features[0].center[0];
        
//             // let startDate = new Date(req.body.startTime);
            
//             User.findById(req.user._id, function(err, user){
//                 // console.log("We got the user")
//                 Trip.create({
//                     tripName: req.body.tripName,
//                     zipStart: req.body.zipStart,
//                     latStart: latStartFromZip,
//                     longStart: longStartFromZip,
//                     startTime: req.body.startTime,
//                     travelTime: req.body.travelTime,
//                     zipDest: req.body.zipDest,
//                     latDest: latDestFromZip,
//                     longDest: longDestFromZip,
//                     returnTime: req.body.returnTime,
//                     returnTravelTime: req.body.returnTravelTime
//                 },
//                 function(err, trip) {
//                     // console.log("trip created", trip)
//                     user.trips.push(trip)
//                     user.save(function(err, user) {
//                         // console.log('this is another user test: ', user)
//                         if (err) console.log(err)
//                         res.json(user) // return the trip id -AdamG
//                     })
//                 })
//             })
//         }).catch((err) =>  {
//             // console.log("Mapbox problem!!!!!");
//         });
//     })
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