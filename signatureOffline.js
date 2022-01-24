const secp = require("@noble/secp256k1");
const SHA256 = require('crypto-js/sha256');
const { hexToBytes, concatBytes, toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
(async () => {
  // copy-paste a private key generated when running server/index.js
  const privateKey = "e5b335d26d9347a6d15a11fecce094d5f4e951ecddc3f0b8411eec59a8f5225f";

  // copy-paste a separate account from your server db in to
  // send an amount less than your current balance!
  const message = JSON.stringify({
    to: "0xaf654e0e5755f3edfab9b7806b502aa7d4dc03fa",
    amount: 50
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