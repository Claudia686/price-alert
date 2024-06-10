import {  useEffect, useState } from 'react'
import { ethers } from 'ethers'
import './App.css';

// ABIS
import PriceAlert from './abis/price-alert.json'

// Config
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
  // Set signer
  const signer = await provider.getSigner()
  const signerAddress = await signer.getAddress()

  // Call setThreshold function 
  const threshold = 1
  const tx = await priceAlert.connect(signer).setThreshold(threshold)
  await tx.wait()
}

const getLatestPriceHandler = async () => {
  const latestPrice = await priceAlert.getLatestPrice()
  setLatestPrice(latestPrice.toString())
}

const loadBlockchainData = async () => {  
  // Get the network
  const { chainId } = await provider.getNetwork()
  console.log('connected to chain:', chainId)

// Connect to the contract, gets the address, abis & provider
 const priceAlertAddress = config[chainId]?.PriceAlert?.address;
 const priceAlert = new ethers.Contract(priceAlertAddress, PriceAlert, provider)
 setPriceAlert(priceAlert)
  }

  // Listen for network changes
  useEffect(() => {
    if (window.ethereum) {
    window.ethereum.on('chainChanged', () => {
    window.location.reload();
      });
    }
  }, []);


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
