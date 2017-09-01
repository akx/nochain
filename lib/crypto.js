const crypto = require("crypto");
const EC = require("elliptic").ec;
const ec = new EC("ed25519");
const {splitMaxCount} = require("./util");

function encodePublicKey(key) {
  return Buffer.from(key.getPublic(true).encode()).toString("base64");
}

function signMessage(message, key) {
  const text = Buffer.from(JSON.stringify(message));
  const signature = Buffer.from(key.sign(text).toDER()).toString("base64");
  return `${signature}.${encodePublicKey(key)}.${text}`;
}

function parseMessage(encodedMessage, verify = true) {
  const [signatureB64, publicKeyB64, payload] = splitMaxCount(encodedMessage, ".", 2);
  if (verify) {
    const publicKey = ec.keyFromPublic(Buffer.from(publicKeyB64, "base64"));
    const signature = Buffer.from(signatureB64, "base64").toString("hex");
    const verified = publicKey.verify(Buffer.from(payload), signature);
    if (!verified) {
      throw new Error(`could not verify ${payload} with public key ${publicKeyB64}`);
    }
  }
  return Object.assign({}, JSON.parse(payload), { from: publicKeyB64 });
}

function genKeyPair() {
  return ec.genKeyPair();
}

module.exports = { signMessage, parseMessage, encodePublicKey, genKeyPair };
