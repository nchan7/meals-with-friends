import React, {useState, useEffect} from 'react';
import {IReview} from '../../src/models/review';
import axios from 'axios';


interface IRestaurantDetails {
    id: number;
    name: string;
    location: IAddress;
    cuisines: string;
    timings: string;
    average_cost_for_two: number;
    highlights: Array<string>;
    thumb: string;
    user_rating: IUserRating;
}

interface IAddress {
  address: string;
  locality: string;
}

interface IUserRating {
  aggregate_rating: string;
}


interface IRestaurantProps {
  api_id: number
}

const Details: React.FC<IRestaurantProps> = ({api_id}) => {
  // const [restaurant_id, setRestaurant_id] = useState<number>(0)
  const [restaurant, setRestaurant] = useState<IRestaurantDetails>({} as IRestaurantDetails)
  const [review, setReview] = useState<string>('')


  
  useEffect( () => {
    console.log("Running the effect")
    axios.get(`/restaurants/${api_id}`).then( (response) => {
      console.log(response.data)
      setRestaurant(response.data);
    })
  }, [api_id])

  function handleReviewChange(e: React.ChangeEvent<HTMLInputElement>) {
    setReview(e.target.value) 
  }

  function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault()
    axios.post('/reviews', {
      api_id: restaurant.id,
      review: review
      }).then(res => {
          console.log(res.data)
      }).catch(err => {
          console.log("Error:", err)
      })
    console.log("it works!")
}

var restaurantDetails;
  if (restaurant !==null && Object.keys(restaurant).length > 0) {
      restaurantDetails = (
      <div className='restaurantdetails'>
        <h3>{restaurant.name}</h3>
        <img src={`${restaurant.thumb}`} alt=""/>
        <h4>Address: {restaurant.location.address}</h4>
        <h4>Hours: {restaurant.timings}</h4>
        <h4>{restaurant.cuisines}</h4>
        <p>Average Cost for Two: ${restaurant.average_cost_for_two}</p>
      </div>
      )
  } else {
    restaurantDetails = <p></p>
  }




return (
    <>
      {restaurantDetails}
      <h3>Add a Review</h3>
      <form onSubmit={handleReviewSubmit}>
        <input onChange={handleReviewChange}
          value={review}
          type="text"
          name="review"
          placeholder="Add a review" /> <br/> <br/>
        <input type="submit" value="Submit" />
      </form>
    </>
  )
}

export default Details;