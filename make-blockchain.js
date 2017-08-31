const fs = require("fs");
const { signMessage, genKeyPair, encodePublicKey } = require("./lib/crypto");
const { generateBlock, parseBlock, genesisBlock, encodedGenesisBlock } = require("./lib/block");
const blather = require("./blather");
const keys = [genKeyPair(), genKeyPair(), genKeyPair(), genKeyPair()];

function synthesizeMessage() {
  const sender = keys[0 | (Math.random() * keys.length)];
  let payload;
  if (Math.random() < 0.7) {
    const receiver = keys[0 | (Math.random() * keys.length)];
    payload = { type: "send", to: encodePublicKey(receiver), value: Math.floor(Math.random() * 50000) };
  } else {
    payload = { type: "text", text: blather() };
  }
  return signMessage(payload, sender);
}

function synthesizeBlockchain(nBlocks = 10, nMessages = 10) {
  const blockchain = [genesisBlock];

  let messages = []; // "mempool"
  for (var bl = 0; bl < nBlocks; bl++) {
    for (var i = 0; i < nMessages; i++) {
      messages.push(synthesizeMessage());
    }
    const previousBlock = blockchain[blockchain.length - 1];
    const bgi = generateBlock(messages, previousBlock);
    const parsedBlock = parseBlock(bgi.block, previousBlock);
    messages = bgi.leftoverMessages;
    blockchain.push(parsedBlock);
    console.log(`Hooray, ${bgi.block.length} byte block ${parsedBlock.header.height} is born!`);
  }
  return blockchain.slice(1).map(b => b.encoded);
}

const blockchain = [encodedGenesisBlock].concat(synthesizeBlockchain(10));

fs.writeFileSync("blockchain.txt", blockchain.join("\n"), "utf-8");
