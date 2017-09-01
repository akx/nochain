const crypto = require("crypto");
const EC = require("elliptic").ec;
const ec = new EC("ed25519");
const {splitMaxCount} = require("./util");

function encodePublicKey(key) {
  return Buffer.from(key.getPublic(true).encode()).toString("base64");
}

function generateMessageId(signedMessage) {
  const hasher = crypto.createHash("sha256");
  hasher.update(signedMessage);
  return hasher.digest("base64");
}

function signMessage(message, key) {
  const text = Buffer.from(JSON.stringify(message));
  const signature = Buffer.from(key.sign(text).toDER()).toString("base64");
  const signedMessage = `${signature}.${encodePublicKey(key)}.${text}`;
  return `${generateMessageId(signedMessage)}.${signedMessage}`;
}

function parseMessage(encodedMessage, verify = true) {
  const [messageId, ...signedMessage] = splitMaxCount(encodedMessage, ".", 3);
  const [signatureB64, publicKeyB64, payload] = signedMessage;
  if (verify) {
    const expectedMessageId = generateMessageId(signedMessage.join("."));
    if(messageId !== expectedMessageId) {
      throw new Error(`invalid message ID (expected ${expectedMessageId}, got ${messageId})`);
    }
    const publicKey = ec.keyFromPublic(Buffer.from(publicKeyB64, "base64"));
    const signature = Buffer.from(signatureB64, "base64").toString("hex");
    if (!publicKey.verify(Buffer.from(payload), signature)) {
      throw new Error(`could not verify ${payload} with public key ${publicKeyB64}`);
    }
  }
  return Object.assign({}, JSON.parse(payload), { from: publicKeyB64, id: messageId });
}

function genKeyPair() {
  return ec.genKeyPair();
}

module.exports = { signMessage, parseMessage, encodePublicKey, genKeyPair };
