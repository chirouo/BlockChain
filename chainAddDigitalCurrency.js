//use the transaction replace the data of block
const sha256 = require("crypto-js/sha256");
//需要一个Block Chain
class Transaction {
  constructor(from, to, amount) {
    this.from = from;
    this.to = to;
    this.amount == amount;
  }
}
class Block {
  constructor(transactions, previousHash) {
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = 1; //随机数--用来动态计算区块hash的值以满足区块立链的难度要求
    this.timestamp = Date.now();
    this.hash = this.computeHash();
  }
  computeHash() {
    return sha256(
      JSON.stringify(this.transactions) + this.previousHash + this.nonce
    ).toString();
  }
  //获得区块链的工作证明答案
  getAnswer(difficulty) {
    let answer = "";
    for (let i = 1; i <= difficulty; i++) {
      answer += "0";
    }
    return answer;
  }
  //开始挖矿--计算符合区块链要求难度的hash
  mine(difficulty) {
    while (true) {
      this.hash = this.computeHash();
      if (this.hash.substring(0, difficulty) !== this.getAnswer(difficulty)) {
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
  constructor(difficulty) {
    this.difficulty = difficulty;
    this.chain = [this.bigBang()];
    this.rewardAmount = 50;
    this.transactionsPool = [];
  }
  bigBang() {
    const genesisBlock = new Block("我是祖先区块", "");
    return genesisBlock;
  }
  addTransaction(transaction) {
    this.transactionsPool.push(transaction);
  }
  mineTransactionPool(rewardAddress) {
    //发放奖励
    const rewardTransaction = new Transaction(
      "",
      rewardAddress,
      this.rewardAmount
    );
    this.addTransaction(rewardTransaction);
    //挖矿
    const newBlock = new Block(
      this.transactionsPool,
      this.getLatestBlock().hash
    );
    newBlock.mine(this.difficulty);
    this.chain.push(newBlock);
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
  // addBlockToChain(newBlock) {  //区块是自动在链上生成的，不是自己加的
  //   newBlock.previousHash = this.getLatestBlock().hash;
  //   newBlock.hash = newBlock.computeHash();
  //   //设置添加区块的条件--满足区块链的difficulty
  //   newBlock.mine(this.difficulty);
  //   this.chain.push(newBlock);
  // }
}
// const gxchain = new Chain();
// const block1 = new Block("转账10元", "");
// const block2 = new Block("转账100元", "");
// gxchain.addBlockToChain(block1);
// gxchain.addBlockToChain(block2);
// console.log(gxchain);
// console.log(gxchain.validateChain());
// gxchain.chain[0].mine(2);
// gxchain.chain[1].data = "转账10个10元";
// console.log(gxchain);
// console.log(gxchain.validateChain());
// gxchain.chain[0].data = "我不是祖先区块";
// console.log(gxchain);
// console.log(gxchain.validateChain());
// gxchain.chain[1].data = "转账100元";
// console.log(gxchain);
// console.log(gxchain.validateChain());
const gxChain = new Chain(5);
console.log(gxChain);
const transaction1 = new Transaction("addr1", "100元");
const transaction2 = new Transaction("addr2", "1000元");
gxChain.addTransaction(transaction1);
gxChain.addTransaction(transaction2);
gxChain.mineTransactionPool("addr1");
console.log(gxChain);
// console.log(JSON.stringify(gxChain.chain[1].transactions));
