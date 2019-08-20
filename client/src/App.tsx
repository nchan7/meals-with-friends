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
        <>
          <p>Hello, {user.name}</p>
          <p onClick={logout}>Logout!</p>
        </>
      );
    } else {
      contents = (
        <>
          <p>Please signup or login</p>
          {/* <Login setToken={setToken} />
          <Signup setToken={setToken} /> */}
        </>
      );
    }
    return (
      <div className="App">
        <Router>
          <nav>
            <Link to='/' className='link'>Home</Link>
            <Link to='/login' className='link'>Login</Link>
            <Link to='/signup' className='link'>Signup</Link>
          </nav>
          <Route exact path='/' render={(props) => <Home token={token}/>}/>
        {/* {contents} */}
          <Route exact path='/login' render={(props) => <Login setToken={setToken}/>}/>
          <Route exact path='/signup' render={(props) => <Signup setToken={setToken}/>}/>
        </Router>
      </div>
    );
  
}

export default App;
