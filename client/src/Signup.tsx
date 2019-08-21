import React, {useState} from 'react';
import axios from 'axios';
import {ILiftToken} from './App'; 

//* component written with the help of Kelsey Cox - https://github.com/kelcc169/jwt-auth-typescript/blob/master/client/src/Signup.tsx


const Signup: React.FC<ILiftToken> = ({setToken}) => {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    //* Will need to separate this out in Typescript
    function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        setName(e.target.value)
    }

    function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value)     
    }

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value) 
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        axios.post('/auth/signup', {
            name: name,
            email: email,
            password: password
        }).then(res => {
            if (res.data.type === 'error') {
                    setName('');
                    setEmail('');
                    setPassword('');
                    setMessage(res.data.message); 
            } else {
                localStorage.setItem('mernToken', res.data.token)
                setToken(res.data.token)
            }
        }).catch(err => {
            setMessage('Maximum accounts exceeded. Please try again later.') 
        })
    }

    return (
        <div className='Signup'>
            <h3>Create a new account:</h3>
            <form onSubmit={handleSubmit}>
                <input onChange={handleNameChange}
                        value={name}
                        type='text'
                        name='name'
                        placeholder='Enter your name...'/> <br/>
                <input onChange={handleEmailChange}
                        value={email}
                        type='email'
                        name='email'
                        placeholder='Enter your email...'/> <br/>
                <input onChange={handlePasswordChange}
                        value={password}
                        type='password'
                        name='password'
                        placeholder='Choose a password...'/> <br/>
                <input className="button" type="submit" value='Sign up!'/>
            </form>
        </div>
    );
    
}

export default Signup; 