const hre = require("hardhat");

async function main() {
	// Setup accounts & variables
	[deployer, user] = await ethers.getSigners()
	const priceFeedAddress = '0x14866185B1962B63C3Ea9E03Bc1da838bab34C19' // Sepolia DAI / USD

	// Deploy the contract
	const PriceAlert = await ethers.getContractFactory('PriceAlert');
	const priceAlert = await PriceAlert.deploy(priceFeedAddress)	
	priceAlert.waitForDeployment()   
	console.log(`priceAlert deployed to: ${await priceAlert.getAddress()}`)
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
})