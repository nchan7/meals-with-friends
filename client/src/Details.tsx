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
  api_id: number;
  token: String;
}

const Details: React.FC<IRestaurantProps> = ({api_id, token}) => {
  // const [restaurant_id, setRestaurant_id] = useState<number>(0)
  const [restaurant, setRestaurant] = useState<IRestaurantDetails>({} as IRestaurantDetails)
  const [review, setReview] = useState<string>('')
  const [reviews, setReviews] = useState<IReview[]>([])
  const [dependancy, setDependancy] = useState<number>(0)
  
  useEffect( () => {
    console.log("Running the first effect")
    axios.get(`/restaurants/${api_id}`).then( (response) => {
      console.log(response.data)
      setRestaurant(response.data);
    })
  }, [api_id])

  useEffect( () => {
    console.log("Running the second effect")
    axios.get(`/restaurants/reviews/${api_id}`).then( (response) => {
      console.log(response.data)
      setReviews(response.data);
    })
  }, [dependancy, api_id])

  function handleReviewChange(e: React.ChangeEvent<HTMLInputElement>) {
    setReview(e.target.value) 
  }

  function handleReviewSubmit(e: React.FormEvent) {
    e.preventDefault()
    let config = {
      headers: {
          Authorization: `Bearer ${token}`
      }
    }
    console.log("Restaurant ID", restaurant.id)
    axios.post('/reviews', {
      api_id: restaurant.id,
      review: review
      }, config).then(res => {
          console.log(res.data)
          setDependancy(dependancy + 1);
      }).catch(err => {
          console.log("Error:", err)
      })
    console.log("it works!")
    setReview('')
  }

  var restaurantDetails;
  if (restaurant !==null && Object.keys(restaurant).length > 0) {
      restaurantDetails = (
      <div className='restaurantdetails'>
        <h2>{restaurant.name}</h2>
        <img className="thumb" src={`${restaurant.thumb}`} alt=""/>
        <h4>Address: {restaurant.location.address}</h4>
        <h4>Hours: {restaurant.timings}</h4>
        <h4>{restaurant.cuisines}</h4>
        <p>Average Cost for Two: ${restaurant.average_cost_for_two}</p>
      </div>
      )
  } else {
    restaurantDetails = <p></p>
  }

  var reviewDetails;
  if (reviews.length > 0) {
    reviewDetails = reviews.map((review, i) => {
      let timestamp = review._id.toString().substring(0,8)
      // let date = new Date( parseInt( timestamp, 16 ) * 1000 )
      return (
        <div key={i} className='review'>
          <p>{review.review}</p>
          <p>By: {review.user_name}</p>
          {/* <p>{date}</p> */}
        </div>
      )
    })
  } else {
    reviewDetails = <p></p>
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
          placeholder="Comment..."/> <br/> <br/>
        <input className="button" type="submit" value="Submit" />
      </form>
      {reviewDetails}
    </>
  )
}

export default Details;