import { useEffect, useState } from 'react'
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
  const [isConnected, setIsConnected] = useState(false)
  const [priceLimit, setPriceLimit] = useState('')
  const [latestPrice, setLatestPrice] = useState(null)
  const [checkAlert, setCheckAlert] = useState(null)

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

  const priceLimitHandler = async () => {
    // Set signer    
    const signer = await provider.getSigner()
    const signerAddress = await signer.getAddress()

    // Convert the entered price limit  
    const limit = ethers.parseUnits(priceLimit, 8)
    const tx = await priceAlert.connect(signer).setPriceLimit(limit)
    await tx.wait()
  }

  const getLatestPriceHandler = async () => {
    // Set signer
    const signer = await provider.getSigner()
    const signerAddress = await signer.getAddress()

    // Fetch the latest price from the smart contract and format it
    const latestPrice = await priceAlert.getLatestPrice()
    const getLatestPrice = ethers.formatUnits(latestPrice, 8)
    setLatestPrice(getLatestPrice)    
  }

   const checkAlertHandler = async () => {
    // Set signer
    const signer = await provider.getSigner()

    // Check if the latest price meets or exceeds the set price limit
    const signerAddress = await signer.getAddress()
    const alert = await priceAlert.connect(signer).checkAlert()
    setCheckAlert(alert.toString())
  }
  
  const loadBlockchainData = async () => {  
    // Get the network
    const { chainId } = await provider.getNetwork()
    console.log('Connected to chain:', chainId)

    // Connect to the contract, gets the address, ABIs & provider
    const priceAlertAddress = config[chainId]?.PriceAlert?.address
    const priceAlert = new ethers.Contract(priceAlertAddress, PriceAlert, provider)
    setPriceAlert(priceAlert) 
  }

  // Listen for network changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload()
      })
    }
  }, [])

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

      <div className="price-limit-section">
        <div>
          <label>
            Enter price limit
            <br />
            <input
              type="number"
              value={priceLimit}
              onChange={(e) => setPriceLimit(e.target.value)}
            />
          </label>
          <br />
          <button onClick={priceLimitHandler}>Set Price Limit</button>
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
        <label>Check if the latest price meets or exceeds the price limit set</label>
        <br />
        <button onClick={checkAlertHandler}>Check Alert</button>
        </div>
        { checkAlert !== null && (
        <p>
          Alert status: {checkAlert === 'true' ? 'True - Price limit met' : 'False - Price limit not met'}
        </p>
      )}
    </div>
  )
}

export default App
