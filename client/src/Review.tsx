import React, {useState} from 'react';
import {IReview} from '../../src/models/review';

const Review: React.FC = () => {
  const [review, setReview] = useState<string>('')

  function handleReviewChange(e: React.ChangeEvent<HTMLInputElement>) {
    setReview(e.target.value) 
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // axios.post('/reviews', {
    //   search: search
    //   }).then(res => {
    //       console.log(res.data)
    //       setRestaurants(res.data)
    //   }).catch(err => {
    //       console.log("Error:", err)
    //   })
}

  return (
    <>
      <h3>Add a Review</h3>
      <form onSubmit={handleSubmit}>
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

export default Review;