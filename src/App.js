import './App.css';
import React from 'react';
import Login from './Pages/Login';
import LandingPage from './Pages/LandingPage';

function App() {
  
  const token = localStorage.getItem('token');

  return (
    <>
      {token ? <LandingPage /> : <LandingPage />}
    </>
  );
}

export default App;
