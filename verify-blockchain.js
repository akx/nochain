const fs = require("fs");

const { parseBlock, encodedGenesisBlock } = require("./lib/block");
const { parseMessage } = require("./lib/crypto");

const encodedBlockchain = fs.readFileSync("blockchain.txt", "utf-8").split("\n");

const blockchain = [];
encodedBlockchain.forEach(encodedBlock => {
  if (encodedBlock === encodedGenesisBlock) {
    // Implicitly trust the genesis block
    blockchain.push(parseBlock(encodedBlock, null, false));
    return;
  }
  const block = parseBlock(encodedBlock, blockchain[blockchain.length - 1]);
  blockchain.push(block);
});
console.log(`Read ${blockchain.length} blocks`);
const messages = blockchain.reduce((messages, block) => [].concat(messages, block.messages), []).map(parseMessage);
console.log(`Total ${messages.length} messages`);
const balances = {};
messages.filter(m => m.type === "send").forEach(({ from, to, value }) => {
  balances[from] = (balances[from] || 0) - value;
  balances[to] = (balances[to] || 0) + value;
});
console.log(`Total balances of 'send' messages:`);
Object.keys(balances)
  .sort()
  .forEach(publicKey => {
    console.log(`${publicKey}: ${balances[publicKey]}`);
  });
console.log(`Text messages:`);
messages.filter(m => m.type === "text").forEach(({ from, text }) => {
  console.log(`<${from}> ${text}`);
});
