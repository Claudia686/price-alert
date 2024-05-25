const {
    expect
} = require('chai');
const {
    ethers
} = require('hardhat');

describe('PriceAlert', () => {
    let priceAlert, priceFeed, deployer, user
    const priceFeedAddress = '0x14866185B1962B63C3Ea9E03Bc1da838bab34C19' // DAI / USD

    beforeEach(async () => {
      [deployer, user] = await ethers.getSigners()

        const PriceAlert = await ethers.getContractFactory('PriceAlert');
        priceAlert = await PriceAlert.deploy(priceFeedAddress)
    })

        describe('Deployment', () => {
            it('Should deploy with correct price feed address', async () => {
                const storepriceFeedAddress = await priceAlert.getPriceFeedAddress()
                expect(storepriceFeedAddress).to.equal(priceFeedAddress)
            })
        })

    describe('Set Threshold', () => {
        describe('Success', async () => {
            it('Should set threshold for a user', async () => {
                const newThreshold = ethers.parseUnits('2', 18);

                // Call setThreshold function 
                const tx = await priceAlert.connect(deployer).setThreshold(newThreshold)
                await tx.wait()

                // Verify if threshold was set correctly
                const storeThreshold = await priceAlert.thresholds(deployer.address)
                expect(storeThreshold).to.equal(newThreshold)
            })

            it('Emit ThresholdSet event', async () => {
                const newThreshold = await ethers.parseUnits('1', 18)
                const tx = await priceAlert.connect(user).setThreshold(newThreshold)
                await expect(tx).to.emit(priceAlert, 'ThresholdSet').withArgs(user, newThreshold)
            })
        })

        describe('Failure', async () => {
            it('Revert with zero threshold', async () => {
                const zeroThreshold = 0;
                expect(priceAlert.connect(user).setThreshold(zeroThreshold)).to.be.revertedWith('Threshold must be greater than zero')
            })
        })
    })

})