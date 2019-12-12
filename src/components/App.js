import React from 'react';
import 'milligram';
import './App.css';
import AwesomeSignUp from './AwesomeSignUp';

function App() {
  function register(data) {
    console.log({ ...data });
  }

  return (
    <div className="App">
      <h1>The Forms App</h1>
      <AwesomeSignUp register={register} />
    </div>
  );
}

export default App;
