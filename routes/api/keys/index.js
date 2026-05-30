const fs = require('fs');
const path = require('path');

const key = fs.readFileSync(path.join(__dirname, 'jwtRS256.key'), 'utf8');
const keyPub = fs.readFileSync(path.join(__dirname, 'jwtRS256.key.pub'), 'utf8');
console.log(key.substring(0, 100));
console.log(keyPub.substring(0, 100));
module.exports = { key, keyPub };
