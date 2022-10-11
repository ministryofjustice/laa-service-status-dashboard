import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './assets/css/App.css';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Dashboard />}></Route>
        <Route path='/admin' element={<Admin />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
