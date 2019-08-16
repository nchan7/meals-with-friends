import React, {useState} from 'react';
import axios from 'axios';
import {ILiftToken} from './App'; 

//* make this class component becuase it'll have a form in it and we want to hook up form into state

//* component written with the help of Kelsey Cox - https://github.com/kelcc169/jwt-auth-typescript/blob/master/client/src/Login.tsx

const Login: React.FC<ILiftToken> = ({setToken}) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');


    function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) { //* Since these are text boxes no need for e.preventDefault
        setEmail(e.target.value)     
    }

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) { //* Since these are text boxes no need for e.preventDefault
        setPassword(e.target.value) 
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        axios.post('/auth/login', {
            email: email, 
            password: password
        }).then(res => {
            if (res.data.type === 'error') {
                setMessage(res.data.message);
            } else {
                localStorage.setItem('mernToken', res.data.token)
                setToken(res.data.token)
            }
        }).catch(err => {
            setMessage("Maximum login attempts exceeded. Please try again later.") 
        })
    }

    return (
        <div className="Login">
            <h3>Log into your account:</h3>
            <form onSubmit={handleSubmit}>
                <input onChange={handleEmailChange}
                        value={email}
                        type="email"
                        name="email"
                        placeholder="Enter your email..." /><br />
                <input onChange={handlePasswordChange}
                        value={password}
                        type="password"
                        name="password"
                        placeholder="Enter your password..." /><br />
                <input type="submit" value="Log in!" />
            </form>
        </div>
    );
}






export default Login;