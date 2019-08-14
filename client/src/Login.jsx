import React from 'react';
import axios from 'axios';

//* make this class component becuase it'll have a form in it and we want to hook up form into state

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            message: ''
        }
        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleEmailChange(e) { //* Since these are text boxes no need for e.preventDefault
        this.setState({
            email: e.target.value
        })
    }

    handlePasswordChange(e) { //* Since these are text boxes no need for e.preventDefault
        this.setState({
            password: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault()
        axios.post('/auth/login', {
            email: this.state.email, 
            password: this.state.password
        }).then(res => {
            if (res.data.type === 'error') {
                this.setState({
                    message: res.data.message
                })
            } else {
                localStorage.setItem('mernToken', res.data.token)
                this.props.liftToken(res.data)
            }
        }).catch(err => {
            this.setState({
                message: "Maximum login attempts exceeded. Please try again later."
            })
        })
    }

    render() {
        return (
            <div className="Login">
                <h3>Log into your account:</h3>
                <form onSubmit={this.handleSubmit}>
                    <input onChange={this.handleEmailChange}
                            value={this.state.email}
                            type="email"
                            name="email"
                            placeholder="Enter your email..." /><br />
                    <input onChange={this.handlePasswordChange}
                            value={this.state.password}
                            type="password"
                            name="password"
                            placeholder="Enter your password..." /><br />
                    <input type="submit" value="Log in!" />
                </form>
            </div>
        );
    }

}




export default Login;