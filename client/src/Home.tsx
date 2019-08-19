import React, {useState, useEffect} from 'react';
import {
    Link
    } from 'react-router-dom';
import axios from 'axios';

export interface IRestaurant {
  id: number;
  name: string;
}

const Home: React.FC = () => { 
  const [search, setSearch] = useState<string>('')
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([])


  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value) 
  }

  function handleSubmit(e: React.FormEvent) {
      e.preventDefault()
      axios.get('/restaurant', {
      }).then(res => {
          setRestaurants(res.data)
      }).catch(err => {
          console.log("Error:", err)
      })
  }

  var restaurantData = restaurants.map((restaurant, id) => {
    return <p>{restaurant.name}</p>
  })

  return(
    <div>
            <h3>What would you like to eat today?</h3>
            <form onSubmit={handleSubmit}>
                <input onChange={handleSearchChange}
                        value={search}
                        type="search"
                        name="searchLocation"
                        placeholder="Enter a location" /><br />
                <input type="submit" value="Go!" />
            </form>
            {restaurantData}
        </div>
  );
}

export default Home; 