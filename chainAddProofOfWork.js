const sha256 = require("crypto-js/sha256");
//需要一个Block Chain
class Block {
  constructor(data, previousHash) {
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 1; //随机数--用来动态计算区块hash的值以满足区块立链的难度要求
    this.hash = this.computeHash();
  }
  computeHash() {
    return sha256(this.data + this.previousHash + this.nonce).toString();
  }
  //获得区块链的工作证明答案
  getAnswer(diifficulty) {
    let answer = "";
    for (let i = 1; i <= diifficulty; i++) {
      answer += "0";
    }
    return answer;
  }
  //开始挖矿--计算符合区块链要求难度的hash
  mine(diifficulty) {
    while (true) {
      this.hash = this.computeHash();
      if (this.hash.substring(0, diifficulty) !== this.getAnswer(diifficulty)) {
        this.nonce++;
        this.hash = this.computeHash();
      } else {
        break;
      }
    }
    console.log("挖矿结束", this.hash);
  }
}
class Chain {
  constructor() {
    this.diifficulty = 2;
    this.chain = [this.bigBang()];
  }
  bigBang() {
    const genesisBlock = new Block("我是祖先区块", "");
    return genesisBlock;
  }
  validateChain() {
    //如果链的长度为1
    if (this.chain.length === 1) {
      if (this.chain[0].hash !== this.chain[0].computeHash()) {
        console.log("祖先的数据被篡改了");
        return false;
      }
      return true;
    }
    //如果链的长度不为1，那么从第二开始检验,这里祖先区块的数据检验放在for循环里的最后一个if里面了
    for (let i = 1; i <= this.chain.length - 1; i++) {
      const blockToValidate = this.chain[i];
      if (blockToValidate.hash !== blockToValidate.computeHash()) {
        console.log("数据被篡改了");
        return false;
      }
      const previousBlock = this.chain[i - 1];
      if (blockToValidate.previousHash !== previousBlock.computeHash()) {
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
    newBlock.hash = newBlock.computeHash();
    //设置添加区块的条件--满足区块链的difficulty
    newBlock.mine(this.diifficulty);
    this.chain.push(newBlock);
  }
}
const gxchain = new Chain();
const block1 = new Block("转账10元", "");
const block2 = new Block("转账100元", "");
gxchain.addBlockToChain(block1);
gxchain.addBlockToChain(block2);
console.log(gxchain);
console.log(gxchain.validateChain());
gxchain.chain[0].mine(2);
gxchain.chain[1].data = "转账10个10元";
console.log(gxchain);
console.log(gxchain.validateChain());
// gxchain.chain[0].data = "我不是祖先区块";
// console.log(gxchain);
// console.log(gxchain.validateChain());
// gxchain.chain[1].data = "转账100元";
// console.log(gxchain);
// console.log(gxchain.validateChain());
