// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceAlert {
    AggregatorV3Interface internal priceFeed;
	mapping(address => uint256) public priceLimits;

	// Emit event when new price limit is set
	event PriceLimitSet(address indexed user, uint256 priceLimit);
	
	constructor(address _priceFeedAddress) {
	    priceFeed = AggregatorV3Interface(_priceFeedAddress);
    }

    // Getter function to retrieve the price feed address
    function getPriceFeedAddress() public view returns (address) {
    return address(priceFeed);
    }

    // Set price limit for a user
    function setPriceLimit(uint256 _priceLimit) public {
        require(_priceLimit > 0, 'Price limit must be greater than zero');
        priceLimits[msg.sender] = _priceLimit; // Store the price limit in the mapping
	    emit PriceLimitSet(msg.sender, _priceLimit); // Emit PriceLimitSet event
    }

    // Get latest price
    function getLatestPrice() public view returns (int256) {
        require(address(priceFeed) != address(0), 'Invalid price feed address');
        (, int256 price , , ,) = priceFeed.latestRoundData(); // Fetch latest price data from Chainlink
 	    return price; // Return price
    }
 
    // Check alert
    function checkAlert() public view returns (bool) {
        int256 latestPrice = getLatestPrice(); // Fetch the latest price
        uint256 userPriceLimit = priceLimits[msg.sender]; // Get the user's price limit from the mapping
        require(userPriceLimit > 0, 'Price limit not set for the user');
        return latestPrice >= int256(userPriceLimit); // Check if the latest price is greater than or equal to the price limit
    }
}
