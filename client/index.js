import "./index.scss";
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const keccak256 = require("ethereum-cryptography/keccak");

const server = "http://localhost:3042";

document.getElementById("exchange-address").addEventListener('input', ({ target: {value} }) => {
  if(value === "") {
    document.getElementById("balance").innerHTML = 0;
    return;
  }

  fetch(`${server}/balance/${value}`).then((response) => {
    return response.json();
  }).then(({ balance }) => {
    document.getElementById("balance").innerHTML = balance;
  });
});

document.getElementById("transfer-amount").addEventListener('click', () => {
  const recipient = document.getElementById("recipient").value;
  const amount = document.getElementById("send-amount").value;
  const signature = document.getElementById("signature").value;

  





  const body = JSON.stringify({
    recipient, amount, signature
  });

  const request = new Request(`${server}/send`, { method: 'POST', body });

  fetch(request, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    return response.json();
  }).then(({ balance }) => {
    document.getElementById("balance").innerHTML = balance;
  });
});
