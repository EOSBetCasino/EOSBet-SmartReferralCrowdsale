var Crowdsale = artifacts.require("./EOSBetSmartReferralCrowdsale.sol");

module.exports = function(deployer, network, accounts){
	if (network == 'development'){
		// accounts[0] will be owner
		// accounts[1] will be cold wallet
		deployer.deploy(Crowdsale, accounts[1], {from: accounts[0]});
	}
}