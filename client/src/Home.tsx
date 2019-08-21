import React, {useState, useEffect} from 'react';
import {
    Link,
    Route,
    BrowserRouter as Router
    } from 'react-router-dom';
import axios from 'axios';
import { number } from 'prop-types';
import Details from './Details';
import {IHomeProps} from './App';

export interface ILocation {
  // name: string;
  restaurant: IRestaurantData;
}

interface IRestaurantData {
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


const Home: React.FC<IHomeProps> = ({token}) => { 
  const [search, setSearch] = useState<string>('')
  const [restaurants, setRestaurants] = useState<ILocation[]>([])
  const [api_id, setApi_id] = useState<number>(0)


  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value) 
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    axios.post('/restaurants/search', {
      search: search
      }).then(res => {
          console.log(res.data)
          setRestaurants(res.data)
      }).catch(err => {
          console.log("Error:", err)
      })
  }

  function handleRestaurantSubmit(api_id: number, name: String) {
    setApi_id(api_id)
    axios.post('/restaurants', {
      api_id: api_id,
      name: name
    }).then(res => {
      console.log(res.data)
    }).catch(err => {
      console.log("ERROR!", err)
    })
  }


  var restaurantData;
  if (restaurants !==null && Object.keys(restaurants).length > 0) {
    restaurantData = restaurants.map((restaurant, i) => {
      return (
        <div key={i} className='restaurant'>
          <h2>{restaurant.restaurant.name}</h2>
          <h4>Address: {restaurant.restaurant.location.address}</h4>
          <h4>Hours: {restaurant.restaurant.timings}</h4>
          <h4>{restaurant.restaurant.cuisines}</h4>
          <p>Average Cost for Two: ${restaurant.restaurant.average_cost_for_two}</p>
          <Link to={"/details"}><button className='button2' onClick={() => handleRestaurantSubmit(restaurant.restaurant.id, restaurant.restaurant.name) }>See More Details</button></Link>  <br/> <br/>
        </div>
      )
    })
  } else {
    restaurantData = <p></p>
  }

  return(
    <Router>
      <div className='home'>
        <h2>Where would you like to eat today?</h2>
        <form onSubmit={handleSubmit}>
          <input className='search' onChange={handleSearchChange}
            value={search}
            type="search"
            name="searchLocation"
            placeholder="Enter a location" />
          <input className="button" type="submit" value="Go!" />
        </form>
      </div>
      <Route exact path='/details' render={() => <Details api_id={api_id} token={token} />}/>
      {restaurantData}
    </Router>
  );
}

export default Home; 