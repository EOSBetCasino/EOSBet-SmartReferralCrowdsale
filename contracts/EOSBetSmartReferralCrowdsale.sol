pragma solidity ^0.4.23;

import "./SafeMath.sol";

contract EOSBetSmartReferralCrowdsale {

	using SafeMath for *;

	// owner of crowdsale and beneficiary wallet
	address OWNER;
	address COLDWALLET;

	uint256 constant PERCENTAGE_FOR_REFERRED_SENDER = 1;
	uint256 constant PERCENTAGE_FOR_REFERRER = 2;

	// toggle crowdsale on-off
	bool CROWDSALEOPEN;

	// store referral values in ether
	mapping(address => uint256) referredEtherValue;

	// events
	event Referral_BonusToSender(address indexed sender, uint256 etherValue, uint256 referralBonus);
	event Referral_BonusToReferrer(address indexed referrer, uint256 etherValue, uint256 referralBonus);

	// constructor to set owner, crowdsale open, and cold wallet to store funds.
	constructor(address beneficiary) public {
		// set constants
		OWNER = msg.sender;
		CROWDSALEOPEN = true;

		// set cold wallet
		COLDWALLET = beneficiary;
	}

	// function that gets called when an individual contributes ether to the crowdsale with a referral code
	function referral(address referrer) public payable {

		// require that user is sending eth and the sale is open
		require(msg.value > 0 && CROWDSALEOPEN);

		// get the bonuses for the referrer and referree
		uint256 bonusForReferredSender = SafeMath.mul(msg.value, PERCENTAGE_FOR_REFERRED_SENDER) / 100;
		uint256 bonusForReferrer = SafeMath.mul(msg.value, PERCENTAGE_FOR_REFERRER) / 100;

		// give the bonus for the referree
		referredEtherValue[msg.sender] = SafeMath.add(referredEtherValue[msg.sender], bonusForReferredSender);

		// give the bonus for the referrer
		referredEtherValue[referrer] = SafeMath.add(referredEtherValue[referrer], bonusForReferrer);

		// emit events to log the referral 
		emit Referral_BonusToSender(msg.sender, msg.value, bonusForReferredSender);
		emit Referral_BonusToReferrer(referrer, 0, bonusForReferrer);

	}

	// just an empty fallback function to capture all straight sends to the crowdsale, and emit a basic event.
	function () public payable {

		// require that the sale is open
		require(CROWDSALEOPEN);

		// emit event, no bonus 
		emit Referral_BonusToSender(msg.sender, msg.value, 0);
	}

	///////////////////////////////////
	// OWNER ONLY, MANAGEMENT FUNCTIONS
	///////////////////////////////////

	function transferToBeneficiary() public {
		require(msg.sender == OWNER);

		COLDWALLET.transfer(address(this).balance);
	}

	function toggleCrowdsaleOpen(bool open) public {
		require(msg.sender == OWNER);

		CROWDSALEOPEN = open;
	}
}