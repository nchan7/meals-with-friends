import React, {useState, useEffect} from 'react';
import {
    Link
    } from 'react-router-dom';
import axios from 'axios';

export interface ILocation {
  // name: string;
  restaurant: IRestaurant;
}

interface IRestaurant {
  id: number;
  name: string;
  location: IAddress;
  cuisines: string;
  timings: string;
  average_cost_for_two: number;
}

interface IAddress {
  address: string;
}

const Home: React.FC = () => { 
  const [search, setSearch] = useState<string>('')
  const [restaurants, setRestaurants] = useState<ILocation[]>([])


  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value) 
  }

  function handleSubmit(e: React.FormEvent) {
      e.preventDefault()
      axios.post('/restaurants', {
        search: search
        }).then(res => {
            console.log(res.data)
            setRestaurants(res.data)
        }).catch(err => {
            console.log("Error:", err)
        })
  }
  var restaurantData;
  if (restaurants !==null && Object.keys(restaurants).length > 0) {
    restaurantData = restaurants.map((restaurant, id: number) => {
      return (
        <div className='restaurant'>
          <h3 key={id}>{restaurant.restaurant.name}</h3>
          <h4 key={id}>Address: {restaurant.restaurant.location.address}</h4>
          <h4 key={id}>Hours: {restaurant.restaurant.timings}</h4>
          <h4 key={id}>: {restaurant.restaurant.cuisines}</h4>
          <p key={id}>Average Cost for Two: ${restaurant.restaurant.average_cost_for_two}</p> <br/>
        </div>
      )
    })
  } else {
    restaurantData = <p></p>
  }

  return(
    <div>
            <h3>Where would you like to eat today?</h3>
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