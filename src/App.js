import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './assets/css/App.css';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/'>
          <Dashboard />
        </Route>
        <Route path='/admin'>
          <Admin />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
