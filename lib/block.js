const crypto = require("crypto");

const BLOCK_MAX_SIZE = 1 << 22;

const genesisBlock = {
  header: {
    height: 0,
    hash: "Hello, world!"
  },
  messages: []
};

function generateBlockHash(lastBlock, encodedMessages) {
  const hasher = crypto.createHash("sha256");
  hasher.update(lastBlock.header.hash);
  hasher.update(encodedMessages);
  return hasher.digest("base64");
}

function encodeBlock(header, encodedMessages) {
  const encodedHeader = JSON.stringify(header);
  return `${encodedHeader}.${encodedMessages}`;
}

function generateBlock(messages, lastBlock) {
  messages = messages.sort(); // Sort by signature
  let n = messages.length;
  let encodedBlock = null,
    encodedMessages;
  for (let n = 0; n < messages.length; n++) {
    const newEncodedMessages = JSON.stringify(messages.slice(0, n));
    if (newEncodedMessages.length > BLOCK_MAX_SIZE) break;
    encodedMessages = newEncodedMessages;
  }
  const hash = generateBlockHash(lastBlock, encodedMessages);
  const header = { height: lastBlock.header.height + 1, hash, previousHash: lastBlock.header.hash };
  return {
    block: encodeBlock(header, encodedMessages),
    leftoverMessages: messages.slice(n)
  };
}

function parseBlock(encodedBlock, previousBlock, verify = true) {
  const dot = encodedBlock.indexOf(".");
  const headerEnc = encodedBlock.substr(0, dot);
  const messagesEnc = encodedBlock.substr(dot + 1);
  const header = JSON.parse(headerEnc);
  if (verify) {
    if (messagesEnc.length > BLOCK_MAX_SIZE) {
      throw new Error("block max size exceeded");
    }
    if (previousBlock.header.height + 1 !== header.height) {
      throw new Error("block is not direct descendant of previous block");
    }
    if (previousBlock.header.hash !== header.previousHash) {
      throw new Error("previous block's hash != this block's previousHash (fork?)");
    }
    const expectedHash = generateBlockHash(previousBlock, messagesEnc);
    if (header.hash !== expectedHash) {
      throw new Error(`hash mismatch (expected ${expectedHash}, got ${header.hash})`);
    }
  }
  return { header, messages: JSON.parse(messagesEnc), encoded: encodedBlock };
}

const encodedGenesisBlock = encodeBlock(genesisBlock.header, JSON.stringify(genesisBlock.messages));
module.exports = { generateBlock, parseBlock, genesisBlock, encodedGenesisBlock };
