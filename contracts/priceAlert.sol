// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceAlert {
    AggregatorV3Interface internal priceFeed;
	mapping(address => uint256) public thresholds;

	// Emit event when new thresholds is set
	event ThresholdSet(address indexed user, uint256 threshold);
	
	constructor(address _priceFeedAddress) {
	    priceFeed = AggregatorV3Interface(_priceFeedAddress);
	}

    // Getter function to retrieve the price feed address
function getPriceFeedAddress() public view returns (address) {
    return address(priceFeed);
}

// Set thresholds for a user
function setThreshold(uint256 _threshold) public {
	require(_threshold > 0, 'Threshold must be greater than zero');
    thresholds[msg.sender] = _threshold; // Store the threshold in the mapping
	emit ThresholdSet(msg.sender, _threshold); // Emit ThresholdSet event
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
    uint256 userThreshold = thresholds[msg.sender]; // Get the user's threshold from the mapping
    return latestPrice >= int256(userThreshold); // Check if the latest price is greater than or equal to the threshold
 }

}


