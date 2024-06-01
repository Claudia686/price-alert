const hre = require("hardhat");

async function main() {
	// Setup accounts & variables
	[deployer, user] = await ethers.getSigners()
	const priceFeedAddress = '0xc7de7f4d4C9c991fF62a07D18b3E31e349833A18'

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