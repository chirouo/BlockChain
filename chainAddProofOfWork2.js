//this is my second time program it
//first need a sha256
const sha256 = require("./node_modules/crypto-js/sha256");
//then need Block Chain
class Block {
  constructor(data, previousHash) {
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 1;
    this.hash = this.computeHash();
  }
  computeHash() {
    return sha256(this.data + this.previousHash + this.nonce).toString();
  }
  getAnswer(difficulty) {
    let answer = "";
    for (let i = 1; i <= difficulty; i++) {
      answer += "0";
    }
    return answer;
  }
  mine(difficulty) {
    while (true) {
      if (this.hash.substring(0, difficulty) !== this.getAnswer(difficulty)) {
        this.nonce++;
        this.hash = this.computeHash();
      } else {
        console.log("挖矿结束");
        break;
      }
    }
  }
}

class Chain {
  constructor(difficulty) {
    this.chain = [this.bingBang()];
    this.difficulty = difficulty;
  }
  bingBang() {
    return new Block("我是祖先区块", "");
  }
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  addBlockToChain(newBlock) {
    const previousBlock = this.getLatestBlock();
    newBlock.previousHash = previousBlock.hash;
    newBlock.hash = newBlock.computeHash();
    newBlock.mine(this.difficulty);
    this.chain.push(newBlock);
    console.log("添加区块成功");
  }
  validate() {
    if (this.chain.length === 1) {
      if (this.chain[0].hash !== this.chain[0].computeHash()) {
        console.log("祖先区块数据被篡改了");
        return false;
      }
      return true;
    }
    for (let i = 1; i <= this.chain.length - 1; i++) {
      const blockToValidate = this.chain[i];
      if (blockToValidate.hash !== blockToValidate.computeHash()) {
        console.log("数据被篡改了");
        return false;
      }
      const previousBlock = this.chain[i - 1];
      if (blockToValidate.previousHash !== previousBlock.hash) {
        console.log("区块链断裂");
        return false;
      }
    }
    return true;
  }
}
const gxChain = new Chain(5);
const block1 = new Block("转账10元");
gxChain.addBlockToChain(block1);
const block2 = new Block("转账100元");
gxChain.addBlockToChain(block2);
const block3 = new Block("转账1000元");
gxChain.addBlockToChain(block3);
console.log(gxChain);
