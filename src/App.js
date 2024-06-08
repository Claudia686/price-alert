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
const [isConnected, setIsConnected] = useState(false)
const [threshold, setThreshold] = useState('')
const [user, setUser] = useState(null)
const [latestPrice, setLatestPrice] = useState(null)

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

const thresholdHandler = async () => {
  // set signer
  const signer = await provider.getSigner()
  const signerAddress = await signer.getAddress()

  // Call setThreshold function 
  const threshold = 1
  const tx = await priceAlert.connect(signer).setThreshold(threshold)
  await tx.wait()
}

// const getLatestPriceHandler = async () => {
//   try {

//   const latestPrice = await priceAlert.getLatestPrice()
//    console.log('Latest price:', latestPrice.toString());
//      setLatestPrice(latestPrice.toString())

//     } catch (error) {
//       console.error('Error getting latest price:', error);
//     }
//   }


const getLatestPriceHandler = async () => {
    const signer = await provider.getSigner()

  
    try {
      if (!priceAlert) {
        console.error('PriceAlert contract is not initialized');
        return;
      }

      console.log('PriceAlert Contract:', priceAlert);
      console.log('Calling getLatestPrice...');

      const latestPrice = await priceAlert.getLatestPrice();
      console.log('Raw latest price:', latestPrice);

      // Assuming the price is returned with 8 decimal places
      const formattedPrice = ethers.formatUnits(latestPrice, 8);
      setLatestPrice(formattedPrice);
      console.log('Formatted price:', formattedPrice);
    } catch (error) {
      console.error('Error getting latest price:', error);
    }
  };


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
        {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
      </button>
      <br />
      <br />

      <div className="threshold-section">
        <div>
          <label>
            Enter threshold:
            <br />
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
            />
          </label>
          <br />
          <button onClick={thresholdHandler}>Set Threshold</button>
        </div>
      </div>
      
      <div className="get-latest-price-section">
        <button onClick={getLatestPriceHandler}>Get Latest Price</button>
        <div>
          {latestPrice && <p>Latest Price: {latestPrice}</p>}
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
