// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceAlert {
    AggregatorV3Interface internal priceFeed;
	mapping(address => uint256) public thresholds;

	// Emit event when new thresholds is set
	event ThresholdSet(address indexed user, uint256 thresholds);
	
	// constructor
	constructor(address _priceFeedAddress) {
	    priceFeed = AggregatorV3Interface(_priceFeedAddress);
	}

// Set thresholds for a user
function setThreshold(uint256 _threshold) public {
	require(_threshold > 0, 'Threshold must be greater than zero');
    thresholds[msg.sender] = _threshold; // Store the threshold in the mapping
	emit ThresholdSet(msg.sender, _threshold); // Emit ThresholdSet event
 }

}