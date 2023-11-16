const axios = require('axios');
const niceList = require('../utils/niceList.json');
const MerkleTree = require('../utils/MerkleTree');

const serverUrl = 'http://localhost:1225';

function generateRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const merkleTree = new MerkleTree(niceList);
const root = merkleTree.getRoot();
const index = generateRandomInteger(1, 999);
const name = niceList[index];
const proof = merkleTree.getProof(index);

async function main() {
  // TODO: how do we prove to the server we're on the nice list?

  const { data: gift } = await axios.post(`${serverUrl}/gift`, {
    // TODO: add request body parameters here!
    proof,
    root,
    name,
  });

  console.log({ gift });
}

main();
