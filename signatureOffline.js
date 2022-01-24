const secp = require("@noble/secp256k1");
const SHA256 = require('crypto-js/sha256');
const { hexToBytes, concatBytes, toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
(async () => {
  // copy-paste a private key generated when running server/index.js
  const privateKey = "6e131e209daaa7d066eab51b7912b58912cf51f6b31b0821fdb889293a1de35a";

  // copy-paste a separate account from your server db in to
  // send an amount less than your current balance!
  const message = JSON.stringify({
    to: "0x4a758b8bd49cf8c3e604309fade8ec9e00df3b35",
    amount: 17
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