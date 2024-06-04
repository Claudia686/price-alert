import {  useEffect, useState } from 'react'
import { ethers } from 'ethers'
import './App.css';

// ABIS
import PriceAlert from './abis/price-alert.json'
//Config
import config from './config.json'

function App() {
const [provider, setProvider] = useState(null)
const [account, setAccount] = useState(null)
const [priceAlert, setPriceAlert] = useState(null)
const [result, setResult] = useState(null)
const [isConnected, setIsConnected] = useState(null)

const connectHandler = async () => { 
// Provides the blockchain connection to sign transactions with MetaMask
  const provider = new ethers.BrowserProvider(window.ethereum)
  setProvider(provider)

// Connect to MetaMask
const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
const account = ethers.getAddress(accounts[0])
setAccount(account)

setIsConnected(true)
}

const loadBlockchainData = async () => {  
  // Get the network
  const { chainId } = await provider.getNetwork()

// Connect to the contract, gets the address, abis & provider
  const address = '0x82A9286dB983093Ff234cefCea1d8fA66382876B'
  const priceAlert = new ethers.Contract(address, PriceAlert, provider)
  setPriceAlert(priceAlert)
}

useEffect(() => {
    if (provider) {
      loadBlockchainData(provider)
    }
  }, [provider])

return (
   <div className="container">
      <h1>Price Alert Dapp</h1>
      <button onClick={connectHandler}>
      {isConnected? 'Wallet Connected': 'Connect Wallet'}</button>

      <div className="threshold-section">
        <h2>Set Threshold</h2>
        <label htmlFor="threshold">Enter Threshold:</label>
        <br />
        <input
          type="number"
          id="threshold"
          value="threshold"          
           />

           <div>
        </div>
      </div>
      <br />

      <div className="get-latest-price-section"> 
      <button onClick={getLatestPriceHandler}>Get Latest Price</button>
       <div>
          {result && <p>{result}</p>}
        </div>
      </div>

      <div className="check-alert-section">
      <br />
        <label>Check if the latest price meets or exceeds the threshold set.</label>
        <br />
        <button className="check-alert-button">Check Alert</button>
      </div>
    </div>

  );
  }

export default App;

