#!/usr/bin/env node

const wordleReverser = require('./');
const helps = new Set(['help', '--help', '-h'])
if (helps.has(process.argv[2])) {
  console.log(`usage "reverdle word pattern"`)
  console.log(`with "pattern" being a line from a worle result`);
  console.log(`words printed in \u001b[33;1myellow\u001b[0m are possible answers`)
  process.exit();
}
if (process.argv.length !== 4) {
  console.log('requires two arguments, word and pattern');
}
for (const word of wordleReverser(process.argv[2], process.argv[3], 'long')) {
  console.log(word);
}
for (const word of wordleReverser(process.argv[2], process.argv[3], 'short')) {
  console.log(`\u001b[33;1m${word}\u001b[0m`);
}
