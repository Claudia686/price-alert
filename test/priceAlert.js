const {
    expect
} = require('chai');
const {
    ethers
} = require('hardhat');

describe('PriceAlert', () => {
    let priceAlert, priceFeed, deployer, user
    const priceFeedAddress = '0xc7de7f4d4C9c991fF62a07D18b3E31e349833A18'

    beforeEach(async () => {
        // Get signers
        [deployer, user] = await ethers.getSigners()

        // Deploy PriceAlert contract with specified price feed address
        const PriceAlert = await ethers.getContractFactory('PriceAlert');
        priceAlert = await PriceAlert.deploy(priceFeedAddress)
    })

    describe('Deployment', () => {
        it('Should deploy with correct price feed address', async () => {
            // Verify that the price feed address matches the provided address
            const storedPriceFeedAddress = await priceAlert.getPriceFeedAddress()
            expect(storedPriceFeedAddress).to.equal(priceFeedAddress)
        })
    })

    describe('Set Threshold', () => {
        describe('Success', async () => {
            it('Should set threshold for a user', async () => {
                const newThreshold = 10

                // Call setThreshold function 
                const tx = await priceAlert.connect(deployer).setThreshold(newThreshold)
                await tx.wait()

                // Verify if threshold was set correctly
                const storeThreshold = await priceAlert.thresholds(deployer.address)
                expect(storeThreshold).to.equal(newThreshold)
            })

            it('Emit threshold event', async () => {
                const Setthreshold = 5
                const tx = await priceAlert.connect(user).setThreshold(Setthreshold)

                // Verify if the ThresholdSet event is emitted correctly
                await expect(tx).to.emit(priceAlert, 'ThresholdSet').withArgs(user, Setthreshold)
            })
        })

        describe('Failure', async () => {
            it('Revert with zero threshold', async () => {
                const zeroThreshold = 0

                // Expect the setThreshold function to revert with a specific error message
                expect(priceAlert.connect(user).setThreshold(zeroThreshold)).to.be.revertedWith('Threshold must be greater than zero')
            })
        })
    })

    describe('Get Latest Price', () => {
        describe('Success', async () => {
            it('Should get the latest price', async () => {

                // Mocked price value for testing purposes
                const mockPrice = 341318228640216

                // Set set Threshold
                await priceAlert.setThreshold(341318228640216)
                const latestPrice = await priceAlert.getLatestPrice()
                expect(latestPrice).to.equal(mockPrice)
            })
        })

        describe('Failure', async () => {
            let priceAlertWithInvalidFeed
            const invalidPriceFeedAddress = '0x0000000000000000000000000000000000000000'

            beforeEach(async () => {
                // Deploy the PriceAlert contract with an invalid price feed address
                const PriceAlert = await ethers.getContractFactory('PriceAlert')
                priceAlertWithInvalidFeed = await PriceAlert.deploy(invalidPriceFeedAddress)
            })

            it('Rejects invalid price feed address', async () => {
                // Expect the getLatestPrice function to revert with a specific error message
                expect(priceAlertWithInvalidFeed.getLatestPrice()).to.be.revertedWith('Invalid price feed address')
            })
        })
    })

    describe('Check alert', () => {
        describe('Success', async () => {
            it('Should check if an alert is triggered', async () => {
                // Ser a Threshold for a user
                const userThreshold = 5
                await priceAlert.connect(user).setThreshold(userThreshold)

                // Call checkAlert to triggers an alert
                const alertTriggered = await priceAlert.connect(user).checkAlert()

                // Verify that the alert is triggered
                expect(alertTriggered).to.be.true
            })
        })

        describe('Failure', async () => {
            it('Reverts when user Threshold is not set', async () => {
                // Attempt to call checkAlert without setting a threshold for the user
                expect(priceAlert.connect(user).checkAlert()).to.be.revertedWith('Threshold not set for the user')
            })
        })
    })
})