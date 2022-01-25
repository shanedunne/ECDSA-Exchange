const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
// from ethereum cryptography
const SHA256 = require('crypto-js/sha256');
const { hexToBytes, toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const secp = require("@noble/secp256k1");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

// populated after createAccounts function called
const balances = {
}

// Terminal Messages
console.log("-----------------------------------------")
console.log("SEE ACCOUNT DETAILS BELOW")

// account class
class Account {
  constructor(balance) {
    this.privateKey = toHex(secp.utils.randomPrivateKey());
    this.publicKey = "0x" + toHex(secp.getPublicKey(this.privateKey)).slice(-40);
    this.address = `0x${this.publicKey.slice(-40)}`
    this.balance = balance;
  }
}


// Radnom balance generator between 75 and 125
function randomBalanceGenerator() {
  return Math.round(Math.random() * (125 - 75) + 75);
}
// Create accounts function
function createAccounts(account_limit) {
  const accounts = {};

  for (let i = 0; i <= account_limit; i++) {
    accounts[i] = new Account(randomBalanceGenerator());
    const publicKey = accounts[i].publicKey;
    const balance = accounts[i].balance;
    balances[publicKey] = balance;

  }
  return accounts
}
const accountBatch = createAccounts(3)
console.log(accountBatch)




app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const { recipient, amount, signature } = req.body;
  const message = JSON.stringify({
    to: recipient,
    amount: parseInt(amount)
  });
  const messageHash = SHA256(message).toString();
  // recover the public key (just like Ethereum does it) using msgHash, sig, recoveryBit
  const recoveredPublicKey1 = toHex(secp.recoverPublicKey(messageHash, signature, 0));

  // recover the public key (just like Ethereum does it) using msgHash, sig, recoveryBit
  const recoveredPublicKey2 = toHex(secp.recoverPublicKey(messageHash, signature, 1));

  // clean up recovered public key so that we can look up if it matches our own server records
  const senderPublicKey1 = "0x" + recoveredPublicKey1.slice(recoveredPublicKey1.length - 40);

  // clean up recovered public key so that we can look up if it matches our own server records
  const senderPublicKey2 = "0x" + recoveredPublicKey2.slice(recoveredPublicKey2.length - 40);

  let publicKeyMatch = true;

  let senderPublicKey;
  let recoveredPublicKey;

  // if recoverPublicKey() returns correct public key contained in db, else mark false
  if (!balances[senderPublicKey1] && !balances[senderPublicKey2]) {
    console.error("Public key does not match! Make sure you are passing in the correct values!");
    publicKeyMatch = false;
  } else if (!balances[senderPublicKey1] && balances[senderPublicKey2]) {
    senderPublicKey = senderPublicKey2;
    recoveredPublicKey = recoveredPublicKey2;
  } else if (!balances[senderPublicKey2] && balances[senderPublicKey1]) {
    senderPublicKey = senderPublicKey1;
    recoveredPublicKey = recoveredPublicKey1;
  }

  console.log(senderPublicKey + " is attempting to send " + amount + " to " + recipient);

  // this means whoever sent the signature, given the proper address was re-produced,
  // owns the privkey associated to the funds
  if (publicKeyMatch) {
    balances[senderPublicKey] -= amount;
    balances[recipient] = (balances[recipient] || 0) + +amount;
    res.send({ balance: balances[senderPublicKey] });
    console.log(senderPublicKey + " has successfully sent " + amount + " to " + recipient);
  } else {
    console.error("Something seems off! Make sure you are passing in the correct values!");
  }
  

});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
