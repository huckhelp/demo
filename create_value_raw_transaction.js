const Web3 = require('web3')
const ethTx = require('ethereumjs-tx')
const readline = require('readline');


const args = process.argv.slice(2);

var provider = args[0] || 'https://data-seed-prebsc-1-s1.binance.org:8545';

var web3 = new Web3(new Web3.providers.HttpProvider(provider))
web3.transactionConfirmationBlocks = 1;

const addressFrom = '0x344E336921f05c39e640da447A9234C8037e4D70'
const privKey = Buffer.from('0ac4d37b134fae8ad689728be439592ae792e688b5f49c7ddb0c30a15a6218e5', 'hex')


const addressTo = '0x60346AE6Be1Cf325e1f4E5B312E149706B43f370'
const valueInEther = 0.001


web3.eth.getTransactionCount(addressFrom, "pending").then((txnCount) => {
  
  var txObject = {
      nonce: web3.utils.numberToHex(txnCount),
      gasPrice: web3.utils.numberToHex(10000000000),
      gasLimit: web3.utils.numberToHex(100000),
      to: addressTo,
      value: web3.utils.numberToHex(web3.utils.toWei(valueInEther.toString(), 'ether'))
  };

  
  var tx = new ethTx(txObject);
  tx.sign(privKey)

  
  var serializedTx = tx.serialize();
  var rawTxHex = '0x' + serializedTx.toString('hex');

 
  console.log("Raw transaction data: " + rawTxHex);

  
  (async() => {
   
      web3.eth.sendSignedTransaction(rawTxHex)
        .on('receipt', receipt => { console.log('Receipt: ', receipt); })
        .catch(error => { console.log('Error: ', error.message); });
      console.log("******************************************");
      console.log("Value transaction sent, waiting for receipt.");
      console.log("******************************************");
   
  
  })();

})
.catch(error => { console.log('Error: ', error.message); });
