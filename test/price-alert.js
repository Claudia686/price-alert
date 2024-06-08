const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('PriceAlert', () => {
    let priceAlert, priceFeed, deployer, user
    const priceFeedAddress = '0x14866185B1962B63C3Ea9E03Bc1da838bab34C19' // Sepolia DAI / USD

    beforeEach(async () => {
        [deployer, user] = await ethers.getSigners();
        const PriceAlert = await ethers.getContractFactory('PriceAlert')
        priceAlert = await PriceAlert.deploy(priceFeedAddress)
    })

    describe('Deployment', () => {
        it('Should deploy with correct price feed address', async () => {
            const storedPriceFeedAddress = await priceAlert.getPriceFeedAddress()
            expect(storedPriceFeedAddress).to.equal(priceFeedAddress)
        })
    })

    describe('Set Threshold', () => {
        describe('Success', async () => {
            it('Should set threshold for a user', async () => {
                const newThreshold = ethers.parseUnits('2', 18)

                const tx = await priceAlert.connect(deployer).setThreshold(newThreshold)
                await tx.wait();

                const storedThreshold = await priceAlert.thresholds(deployer.address)
                expect(storedThreshold).to.equal(newThreshold)
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

    describe('Get Latest Price', () => {
        describe('Success', async () => {
            it('Should get the latest price', async () => {
                const mockPrice = 99987253;

                await priceAlert.setThreshold(99987253);
                const latestPrice = await priceAlert.getLatestPrice()
                expect(latestPrice).to.equal(mockPrice)
            })
        }) 

        describe('Failure', async () => {
            let priceAlertWithInvalidFeed
            const invalidPriceFeedAddress = '0x0000000000000000000000000000000000000000'

            beforeEach(async () => {
                const PriceAlert = await ethers.getContractFactory('PriceAlert');
                priceAlertWithInvalidFeed = await PriceAlert.deploy(invalidPriceFeedAddress)
            })

            it('Rejects invalid price feed address', async () => {
                await expect(priceAlertWithInvalidFeed.getLatestPrice()).to.be.revertedWith('Invalid price feed address')
            })
        })
    })

    describe('Check alert', () => {
        describe('Success', async () => {
            it('Should check if an alert is triggered', async () => {
                const threshold = ethers.parseUnits('200');
                await priceAlert.connect(user).setThreshold(threshold)

                const userThreshold = 5
                await priceAlert.connect(user).setThreshold(userThreshold)

                const higherPrice = ethers.parseUnits('250');
                const alertTriggered = await priceAlert.connect(user).checkAlert()
                expect(alertTriggered).to.be.true
            })
        })

        describe('Failure', async () => {
            it('Reverts when user Threshold is not set', async () => {
                expect(priceAlert.connect(user).checkAlert()).to.be.revertedWith('Threshold not set for the user')
            })
        })
    })
})

