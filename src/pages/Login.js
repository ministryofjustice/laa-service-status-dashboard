import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

import firebaseApp from '../firebase';

const auth = getAuth(firebaseApp);

const Login = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailed, setLoginFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const doLogin = async (event) => {
    event.preventDefault();

    if (email !== '' && password !== '') {
      try {
        await signInWithEmailAndPassword(auth, email, password)
        onSuccess();
      } catch(error) {
        setLoginFailed(true);
        setErrorMessage(error.message);
      }
    }
    else if (email === '') {
      setLoginFailed(true);
      setErrorMessage('Email required');
    }
    else if (password === '') {
      setLoginFailed(true);
      setErrorMessage('Password required');
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={doLogin} name="form">
        <h1>Login</h1>
        {
          loginFailed ?
            (<div className="error">
              <p className="message">{ errorMessage }</p>
            </div>) : null
        }
        <label htmlFor="emailInput"><b>Email</b></label>
        <input
          id="emailInput"
          className="email"
          type="text"
          placeholder="Enter Email"
          name="email"
          value={ email }
          onChange={ (e) => setEmail(e.target.value) }
        />
        <label htmlFor="passwordInput"><b>Password</b></label>
        <input
          id="passwordInput"
          className="password"
          type="password"
          placeholder="Enter Password"
          name="password"
          value={ password }
          onChange={ (e) => setPassword(e.target.value) }
        />
        <button
          className="w3-btn-block w3-padding-large w3-green"
          type="submit"
        >Login</button>
      </form>
    </div>
  );
}

export default Login;
