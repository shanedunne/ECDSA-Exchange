const secp = require("@noble/secp256k1");
const SHA256 = require('crypto-js/sha256');
const { hexToBytes, concatBytes, toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
(async () => {
  // copy-paste a private key generated when running server/index.js
  const privateKey = "99d3d9844d6a02f3d1c0c602c436c627107d9f4248d2b2d0d01d417dd8ad7ae9";

  // copy-paste a separate account from your server db in to
  // send an amount less than your current balance!
  const message = JSON.stringify({
    to: "0xbc55b6c3bd11ea53997836a95520b3c01f008e88",
    amount: 10
  });

  // hash your message
  const messageHash = SHA256(message).toString();

  // use secp.sign() to produce signature and recovery bit (response is an array of two elements)
  const signatureArray = await secp.sign(messageHash, privateKey, {
    recovered: true
  });
  // separate out returned array into the string signature and the number recoveryBit
  const signature = toHex(signatureArray[0]);
  const recoveryBit = signatureArray[1];

  // use these values in your client!
  console.log("Signature: " + signature);
  console.log("Recovery bit: " + recoveryBit);
})();