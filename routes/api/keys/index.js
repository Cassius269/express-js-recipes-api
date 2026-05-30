const fs = require('fs');
const path = require('path');

const key = fs.readFileSync(path.join(__dirname, 'jwtRS256.key'), 'utf8');
const keyPub = fs.readFileSync(path.join(__dirname, 'jwtRS256.key.pub'), 'utf8');

module.exports = { key, keyPub };
