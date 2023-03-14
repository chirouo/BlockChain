const sha256 = require("crypto-js/sha256");
//需要一个Block Chain
class Block {
  constructor(data, previousHash) {
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.coputeHash();
  }
  coputeHash() {
    return sha256(this.data + this.previousHash).toString();
  }
}
class Chain {
  constructor() {
    this.chain = [this.bigBang()];
  }
  bigBang() {
    const genesisBlock = new Block("我是祖先区块", "");
    return genesisBlock;
  }
  validateChain() {
    //如果链的长度为1
    if (this.chain.length === 1) {
      if (this.chain[0].hash !== this.chain[0].coputeHash()) {
        console.log("祖先的数据被篡改了");
        return false;
      }
      return true;
    }
    //如果链的长度不为1，那么从第二开始检验,这里祖先区块的数据检验放在for循环里的最后一个if里面了
    for (let i = 1; i <= this.chain.length - 1; i++) {
      const blockToValidate = this.chain[i];
      if (blockToValidate.hash !== blockToValidate.coputeHash()) {
        console.log("数据被篡改了");
        return false;
      }
      const previousBlock = this.chain[i - 1];
      if (blockToValidate.previousHash !== previousBlock.coputeHash()) {
        console.log("区块链的链接断了");
        return false;
      }
    }
    return true;
  }
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  addBlockToChain(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.hash = newBlock.coputeHash();
    this.chain.push(newBlock);
  }
}
const gxchain = new Chain();
const block1 = new Block("转账10元", "");
gxchain.addBlockToChain(block1);
console.log(gxchain);
console.log(gxchain.validateChain());
gxchain.chain[0].data = "我不是祖先区块";
console.log(gxchain);
console.log(gxchain.validateChain());
// gxchain.chain[1].data = "转账100元";
// console.log(gxchain);
// console.log(gxchain.validateChain());
