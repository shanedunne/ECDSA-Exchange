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

const balances = {
  "1": 100,
  "2": 50,
  "3": 75,
}


// account class
class account {
  constructor(balance){
    this.privateKey = toHex(secp.utils.randomPrivateKey());
    this.publicKey = toHex(secp.getPublicKey(this.privateKey));
    this.address = `0x${this.publicKey.slice(90)}`
    this.balance = balance;
  }

}

var accountOne = new account(125);
var accountTwo = new account(30);
var accountThree = new account(200);
console.log(accountOne)
console.log(accountTwo)
console.log(accountThree)


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
