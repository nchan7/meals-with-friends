import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import User, {IUser} from '../../src/models/user';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import './App.css'
import Details from './Details';
import Friends from './Friends';


export interface ILiftToken {
  setToken: Function 
}

export interface IHomeProps {
  token: String
}


const App: React.FC = () => {
  const [token, setToken] = useState<String>('')
  const [user, setUser] = useState<IUser>({} as IUser)
  const [errorMessage, setErrorMessage] = useState('')
  // const [apiData, setapiData] = useState('')

  //* Object Destructuring! 
  
  // function liftToken(token: string) {
  //   setToken(token) 
  // }

  function logout() {
    // Remove token from localStorage
    localStorage.removeItem('mernToken');
    // Remove user and token from state
    setToken('')
    setUser({} as IUser)
    
  }

  useEffect(() => {
    // checkForLocalToken()
    var token = localStorage.getItem('mernToken'); //* localStorage lives in the browser...mernToken is key in localStorage
    if (!token || token === 'undefined') {
      // token is invalid or missing
      localStorage.removeItem('mernToken');
      setToken('');
      setUser({} as IUser);
    } else {
      // found a token in localStorage; verify it
      axios.post('/auth/me/from/token', {token})
        .then(res => {
          if(res.data.type === 'error') {
            localStorage.removeItem('mernToken');
            
              setToken('');
              setUser({} as IUser);
              setErrorMessage(res.data.message); 
          } else {
            localStorage.setItem('mernToken', res.data.token);
              setToken(res.data.token);
              setUser(res.data.user);
              setErrorMessage('');
            
          }
        })
    }
  }, [token])

    console.log(user);
    var contents 
    if (Object.keys(user).length > 0) {
      contents = (
        <div className="register">
          <h4>Hello, {user.name}</h4>
          <h5 className="logout" onClick={logout}>Logout!</h5>
        </div>
      );
    } else {
      contents = (
        <div className="register">
          <h5>Please signup or login</h5>
          {/* <Login setToken={setToken} />
          <Signup setToken={setToken} /> */}
        </div>
      );
    }
    return (
      <div className="App">
        <Router>
          <nav>
            <Link to='/' className='linkleft'>Meals With Friends</Link>
            <Link to='/login' className='link'>Login</Link>
            <Link to='/signup' className='link'>Signup</Link>
            <Link to='/friends' className='link'>Connect</Link>
          </nav>
          {contents}
          <Route exact path='/' render={(props) => <Home token={token}/>}/>
          <Route exact path='/friends' component={Friends}/> 
          <Route exact path='/login' render={(props) => <Login setToken={setToken}/>}/>
          <Route exact path='/signup' render={(props) => <Signup setToken={setToken}/>}/>
        </Router>
      </div>
    );
  
}

export default App;
