//this is my second time program it
//first need a sha256
const sha256 = require("./node_modules/crypto-js/sha256");
//then need Block Chain
class transactions {
  constructor(from, to, amount) {
    this.form = from;
    this.to = to;
    this.amount = amount;
  }
}
class Block {
  constructor(transactions, previousHash) {
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = 1;
    this.hash = this.computeHash();
    this.timestamp = Date.now();
  }
  computeHash() {
    return sha256(
      JSON.stringify(this.transactions) + this.previousHash + this.nonce
    ).toString();
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
    this.transactionsPool = [];
    this.difficulty = difficulty;
    this.mineReward = 50;
  }
  bingBang() {
    return new Block("我是祖先区块", "");
  }
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  addTransaction(transactions) {
    this.transactionsPool.push(transactions);
  }
  mineTransactionsPool(rewardAddress) {
    //发放给矿工的奖励
    const transacReward = new transactions("", rewardAddress, this.mineReward);
    this.transactionsPool.push(transacReward);
    //矿工如果想要获得奖励将自己的区块加到链上就必须挖矿
    const block = new Block(this.transactionsPool, this.getLatestBlock().hash);
    block.mine(this.difficulty);
    this.chain.push(block);
  }
  // addBlockToChain(newBlock) {
  //   const previousBlock = this.getLatestBlock();
  //   newBlock.previousHash = previousBlock.hash;
  //   newBlock.hash = newBlock.computeHash();
  //   newBlock.mine(this.difficulty);
  //   this.chain.push(newBlock);
  //   console.log("添加区块成功");
  // }
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
// const gxChain = new Chain(5);
// const block1 = new Block("转账10元");
// gxChain.addBlockToChain(block1);
// const block2 = new Block("转账100元");
// gxChain.addBlockToChain(block2);
// const block3 = new Block("转账1000元");
// gxChain.addBlockToChain(block3);
// console.log(gxChain);

const gxChain = new Chain(5);
const transactions1 = new transactions("addr1", "addr2", 10);
//比特币的数量是固定的，一定有发完的一天，因此每笔转账其实是有手续费的，区块的作用就是记录这些转账记录的同时计算满足链的difficulty的hash，
//因此这个手续费会给区块的挖出人作为奖励（转账记录够多其实这也是一笔可观的奖励）
const transactions2 = new transactions("addr2", "addr1", 20);
gxChain.addTransaction(transactions1);
gxChain.addTransaction(transactions2);
console.log(gxChain);
gxChain.mineTransactionsPool("addr1");
console.log(gxChain);
