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

export default router; 