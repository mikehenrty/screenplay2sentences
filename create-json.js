const readline = require('readline');
const fs = require('fs');
const crypto = require('crypto');

function hash(data) {
  return crypto.createHash("sha256").update(data).digest("base64");
}

const input = readline.createInterface({
  input: fs.createReadStream(process.argv[2])
});

var lines = {};

input.on('line', line => {
  lines[hash(line)] = line;
});

input.on('close', () => {
  console.log(JSON.stringify(lines, null, 2));
});
