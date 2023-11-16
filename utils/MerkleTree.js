const { keccak256 } = require('ethereum-cryptography/keccak');
const { bytesToHex } = require('ethereum-cryptography/utils');

class MerkleTree {
  constructor(leaves) {
    //  array of leaves as input. The leaves are converted to Buffers and then hashed using the keccak256 function
    this.leaves = leaves.map(Buffer.from).map(keccak256);
    // The concat() method is a helper function that concatenates two Buffers and then hashes them using the keccak256 function.
    this.concat = (left, right) => keccak256(Buffer.concat([left, right]));
  }

  getRoot() {
    return bytesToHex(this._getRoot(this.leaves));
  }

  getProof(index, layer = this.leaves, proof = []) {
    if (layer.length === 1) {
      return proof;
    }

    const newLayer = [];

    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i];
      const right = layer[i + 1];

      if (!right) {
        newLayer.push(left);
      } else {
        newLayer.push(this.concat(left, right));

        if (i === index || i === index - 1) {
          let isLeft = !(index % 2);
          proof.push({
            data: isLeft ? bytesToHex(right) : bytesToHex(left),
            left: !isLeft,
          });
        }
      }
    }

    return this.getProof(
      Math.floor(index / 2),
      newLayer,
      proof
    );
  }

  // private function
  _getRoot(leaves = this.leaves) {
    if (leaves.length === 1) {
      return leaves[0];
    }

    const layer = [];

    for (let i = 0; i < leaves.length; i += 2) {
      const left = leaves[i];
      const right = leaves[i + 1];

      if (right) {
        layer.push(this.concat(left, right));
      } else {
        layer.push(left);
      }
    }

    return this._getRoot(layer);
  }
}

module.exports = MerkleTree;
