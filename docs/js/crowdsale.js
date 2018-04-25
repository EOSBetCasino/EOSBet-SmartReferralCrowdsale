// basic function to query for transaction receipt
function getTransactionReceiptMined(txHash) {
  var transactionReceiptAsync = function(resolve, reject) {
    EOSBetCrowdsale.web3.eth.getTransactionReceipt(txHash, (error, receipt) => {
      if (error) {
        reject(error);
      }
      else if (receipt == null) {
        setTimeout(
          () => transactionReceiptAsync(resolve, reject), 500);
      }
      else {
        resolve(receipt);
      }
    });
  };
  return new Promise(transactionReceiptAsync);
};

// var web3 = new Web3();

const EOSBetCrowdsale = {
	// initial constants
	web3 : false,
	crowdsale: null,
	crowdsaleInstance: null,
	refAddress: null,

	init: function(){
		EOSBetCrowdsale.initWeb3();
	},

	initWeb3: function(){
		// pause 500 ms and then check for web3
		setTimeout(function(){

			// web3 available, user is using metamask here!
			if (typeof web3 !== 'undefined'){

				EOSBetCrowdsale.web3 = new Web3(web3.currentProvider);

				// check if the user is on the wrong network
				EOSBetCrowdsale.web3.version.getNetwork((error, result) => {
					if (error || result !== '1'){
						
						EOSBetCrowdsale.wrongNetwork();
					}
					// otherwise, the user has web3 correctly set up on the right network
					else {
						EOSBetCrowdsale.initContract();
					}
				});
				
			}
			// web3 not available, user is not using metamask :(
			else {
				EOSBetCrowdsale.web3 = new Web3();
			}

			return EOSBetCrowdsale.initUI();
		}, 500);
	},

	wrongNetwork: function(){
		var text = "It looks like you have metamask installed, but you are on the wrong network! If you change to the Ethereum Mainnet, you will be able to contribute to the crowdsale and view your referral stats from this page!";
	},

	initContract: function(){
		$.getJSON('./abi/CrowdsaleABI.json', function(data){
			// get contract ABI and init
			var crowdsaleAbi = data;

			EOSBetCrowdsale.crowdsale = EOSBetCrowdsale.web3.eth.contract(crowdsaleAbi);
			EOSBetCrowdsale.crowdsaleInstance = EOSBetCrowdsale.crowdsale.at('0xabde1111111111111111111111111');
		});

		return EOSBetCrowdsale.initPlayerStats();
	},

	initPlayerStats: function(){
		// if accounts === [] then we aren't logged in to metamask
		// else, then accounts[0] is our first account, and we could check for some referrals from this account
		// we should also allow a user to check the referrals of any arbitrary account
		if (EOSBetCrowdsale.web3.eth.accounts.length === 0){
			var text = "It looks like you have metamask installed, but are not logged in! If you log-in, you can use your account to contribute to the crowdsale, and view your referrals!"
		}
		else {
			var playersAccount = EOSBetCrowdsale.web3.eth.accounts[0];
		}
	},

	initUI: function(){

		// get all data after '?'' in url, and slice off the '?'
		var url = window.location.search.slice(1);

		// get the ref info from a properly formed url aka eosbet.io/ico?ref=0xabcedef111111...(valid eth address)
		var ref = url.split('=')[0] == 'ref' ? url.split('=')[1] : '';

		// verify that the ref is a valid ethereum address
		ref = EOSBetCrowdsale.web3.isAddress(ref) ? ref : '';

		if (ref !== ''){
			EOSBetCrowdsale.refAddress = ref;

			return EOSBetCrowdsale.initUI_WithRef(ref);
		}
		else {
			return EOSBetCrowdsale.initUI_NoRef();
		}
	},

	initUI_WithRef: function(refAddress){
		// paste the ref into the web3 referral input box, and craft the extra-data for referrals for use with myetherwallet, etc.
		$('#referral-address').val(refAddress);
		$('#referral-address').attr("disabled", "");

		var txData = EOSBetCrowdsale.generateRefTxData(refAddress);

		$('#tx-data-for-ref').text(txData);
	},

	initUI_NoRef: function(){

	},

	generateRefLink: function(refAddress){
		if (! EOSBetCrowdsale.web3.isAddress(refAddress)){
			return '';
		}
		else {
			return 'https://www.eosbet.io/ico?ref=' + refAddress;
		}
	},

	generateRefTxData: function(refAddress){
		// with this, we are generating the raw data so that someone can paste this blob into, say, MEW and contribute ether w/ a referral
		// as simple as sending ether to an address/contract

		// require refAddress is a valid ethereum address
		if (! EOSBetCrowdsale.web3.isAddress(refAddress)){
			return '';
		}
		else{
			// remove the 0x from the address
			refAddress = refAddress.slice(2);

			// "7247959a": "referral(address)", this is the contract function to call
			var txData = '0x7247959a';

			// now append address, padded to 32 bytes (64 hex chars)
			for (var i = 0; i < 64 - refAddress.length; i++){
				txData = txData + '0';
			}
			txData = txData + refAddress;
			return txData;

		}
	},

	contributeWithRef: function(){
		// this requires metamask to be installed

	},

	contributeNoRef: function(){
		// this requires metamask to be installed

	}

	
}



$(document).ready(function(){
  EOSBetCrowdsale.init();
});