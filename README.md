# EOSBet Smart Referral Crowdsale System

## This smart contract implements a simple crowdsale contract with a referral system, as well as an extremely straightforward interface for the crowdsale contract so that anyone can make & receive referrals, no matter their choice of wallet (Metamask or other).

Many crowdsale contracts have referral systems, so that users can bring their friends into a popular crowdsale and both parties can get some extra tokens!

However many current referral systems are done either manually by filling out a form. Users are often times not given tokens that they deserve after a referral program is complete, and they are very easily gamed and manipulated by crowdsale contributors.

Similarly, users cannot check how many people they have referred, and must trust the ICO that they have accurately tallied up their referrals.

With a **Smart Referral Crowdsale**, we fix all of these issues, and will be implementing this system in our own crowdsale. Referrals are intrinsically tied with your own contribution. Your referrals are stored in the blockchain, so that you can verify that you are credited the tokens that you deserve! Likewise, you can check the status of your referrals using Metamask, or even just etherscan.io.

We similarly make the process of contributing with referral link wallet agnostic, so that any wallet where you can add (copy + paste) **extra-data** can be used to contribute to a crowdsale. We also integrate with Metamask & web3.js, so that our users can contribute to our crowdsale in a single click!

Of course, users can also contribute to the crowdsale without a referral link, through a simple send (to the contracts fallback function).