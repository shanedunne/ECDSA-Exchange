const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
// from ethereum cryptography
const keccak256 = require("ethereum-cryptography/keccak");
const { hexToBytes, toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");

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
  constructor(balance){
    this.privateKey = toHex(secp.utils.randomPrivateKey());
    this.publicKey = toHex(secp.getPublicKey(this.privateKey));
    this.address = `0x${this.publicKey.slice(90)}`
    this.balance = balance;
  }
}


// Radnom balance generator
function randomBalanceGenerator() {
  return Math.round(Math.random() * (125-75) + 75);
}
// Create accounts function
function createAccounts(account_limit){
  const accounts = {};

  for(let i = 1; i <= account_limit; i++) {
    accounts[i] = new Account(randomBalanceGenerator());
    const address = accounts[i].address.toLowerCase();
    const balance = accounts[i].balance
    balances[address] = balance;

  }
  return accounts
}
const accountBatch = createAccounts(3)  
console.log(accountBatch)




app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {sender, recipient, amount} = req.body;
  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + +amount;
  res.send({ balance: balances[sender] });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
