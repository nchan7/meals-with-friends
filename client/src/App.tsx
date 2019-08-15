import React from 'react';
import axios from 'axios';
import Login from './Login';
import Signup from './Signup';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      user: null,
      errorMessage: '',
      apiData: null
    }
    this.checkForLocalToken = this.checkForLocalToken.bind(this) //* May not be necessary since we're not passing it down...but can't hurt
    this.liftToken = this.liftToken.bind(this) 
    this.logout = this.logout.bind(this) 
  }

  checkForLocalToken() {
    var token = localStorage.getItem('mernToken'); //* localStorage lives in the browser...mernToken is key in localStorage
    if (!token || token === 'undefined') {
      // token is invalid or missing
      localStorage.removeItem('mernToken');
      this.setState({
        token: '',
        user: null
      })
    } else {
      // found a token in localStorage; verify it
      axios.post('/auth/me/from/token', {token})
        .then(res => {
          if(res.data.type === 'error') {
            localStorage.removeItem('mernToken');
            this.setState({
              token: '', 
              user: null,
              errorMessage: res.data.message
            })
          } else {
            localStorage.setItem('mernToken', res.data.token);
            this.setState({
              token: res.data.token,
              user: res.data.user,
              errorMessage: ''
            })
          }
        })
    }
  }

  // liftToken(data) {
  //   this.setState({
  //     token: data.token,
  //     user: data.user
  //   })
  // }

  //* Object Destructuring! 
  liftToken({token, user}) {
    this.setState({
      token,
      user
    })
  }

  logout() {
    // Remove token from localStorage
    localStorage.removeItem('mernToken');
    // Remove user and token from state
    this.setState({
      token: '',
      user: null
    })
  }

  componentDidMount() {
    this.checkForLocalToken()
  }

  render() {
    var user = this.state.user
    console.log(user);
    var contents 
    if (user) {
      contents = (
        <>
          <p>Hello, {user.name}</p>
          <p onClick={this.logout}>Logout!</p>
        </>
      );
    } else {
      contents = (
        <>
          <p>Please signup or login</p>
          <Login liftToken={this.liftToken} />
          <Signup liftToken={this.liftToken} />
        </>
      );
    }
    return (
        contents
    );
  }
}

export default App;
