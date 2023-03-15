const sha256 = require("crypto-js/sha256");
function proofOfWork() {
  let data = "gx";
  let x = 1;
  while (true) {
    let result = sha256(data + x);
    if (result.toString().substring(0, 1) !== "0") {
      x++;
    } else {
      console.log(result.toString());
      console.log(x);
      break;
    }
  }
}
proofOfWork();
