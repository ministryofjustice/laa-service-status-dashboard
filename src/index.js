import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router'
import firebase from 'firebase';

import App from './App';
import Admin from './Admin';
import './index.css';

firebase.initializeApp({
  apiKey: "AIzaSyDxH0W0xrJdCReFj-zScY5gFLIbOo98DP0",
  authDomain: "laa-dashboard.firebaseapp.com",
  databaseURL: "https://laa-dashboard.firebaseio.com",
  messagingSenderId: "419470059645"
});

ReactDOM.render((
  <Router history={ browserHistory }>
    <Route path="/" component={ App } />
    <Route path="admin" component={ Admin } />
  </Router>
), document.getElementById('root'));
