nochain
=======

Super duper simple, naive blockchain proof of concept in Node.

Features
--------

* ECC cryptography for messages!
* SHA256 block signing!
* Simple implementation!
* Arbitrary JSON messages!
* Block size limit! (For the hell of it)

Missing Features
----------------

* Networking! – This implementation only generates a blockchain locally.
* Proof-of-... – Anyone in the network (if there was one) can generate blocks at arbitrary speed.
* Minting coins – Could be added by way of a special rule to allow, say, the first message of a block to be a senderless `send` of given value.

Usage
-----

* `npm i` or `yarn` to install the single dependency (`elliptic`)
* Run `node make-blockchain.js` to create `blockchain.txt`
* (Go ahead! Modify `blockchain.txt` at this point, and the next command will crash!)
* Run `node verify-blockchain.js` to read `blockchain.txt` and summarize its contents