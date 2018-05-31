const fs = require('fs');
const path = require('path');
function sum(...rest) {
  var sum = 0;
  for (let n of rest) {
    sum += n;
  }
  return sum;
}
async function readFile() {
  // let expression = await fs.readFile();
  let expression = await new Promise(function (resolve) {
    fs.stat(path.join(__dirname, 'data.txt'), function (err, stat) {
      if (err) {
        console.log(err);
        return;
      }
      fs.readFile(path.join(__dirname, 'data.txt'), 'utf-8', function (err, data) {
        resolve(data);
      })
    })
  }, function (reject) {

  });
  let fn = new Function('return ' + expression);
  let r = fn();
  console.log(`Calculate: ${expression} = ${r}`);
  return r;
}
exports.sum = sum;
exports.readFile = readFile;