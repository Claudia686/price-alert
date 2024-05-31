import {  useEffect, useState } from 'react'
import './App.css';

// Abis
import PriceAlert from './abis/price-alert.json'

//Config
import config from './config.json'


function App() {
// Define data
 
return (
   <div className="container">
      <h1>Price Alert Dapp</h1>
      <button className="connect-wallet-button">Connect wallet</button>

      <div className="threshold-section">
        <h2>Set Threshold</h2>
        <label htmlFor="threshold">Enter Threshold:</label>
        <br />
        <input
          type="number"
          id="threshold"
           />
      </div>

      <div className="get-latest-price-section">
        <button className="get-latest-price-button">Get Latest Price</button>
      </div>

      <div className="check-alert-section" style={{ marginTop: '20px' }}>
        <label>Check if the latest price meets or exceeds the threshold set.</label>
        <br />
        <button className="check-alert-button">Check Alert</button>
      </div>
    </div>
  );
}
export default App;

