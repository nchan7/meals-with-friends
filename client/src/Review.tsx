import React, {useState, useEffect} from 'react';
import {IReview} from '../../src/models/review';
import axios from 'axios';


const Review: React.FC = () => {
  const [reviews, setReviews] = useState<IReview[]>([])


  useEffect( () => {
    console.log("Running the effect")
    axios.get('/reviews').then( (response) => {
      console.log(response.data)
      setReviews(response.data);
    })
  }, [reviews])



  let timestamp = reviewObject._id.toString().substring(0,8)
  let date = new Date( parseInt( timestamp, 16 ) * 1000 )


  return (
    
  )

}

export default Review; 
