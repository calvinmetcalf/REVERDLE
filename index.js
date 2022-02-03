const {short, long} = require('./words');
const makePatern = require('./make-patern');
function * dictIter(dict, ptest =()=>true, stest=()=>true, word, pattern){
  for (const [prefix, value] of Object.entries(dict)) {
    if (!ptest(prefix)) {
      continue;
    }
    const len = value.length/3;
    let i = -1;
    while (++i < len) {
      const sufix = value.slice(i*3, (i+1)*3);
      if (stest(sufix, prefix)) {
        yield prefix+sufix
      }
    }
  }
}
const reg = /^[bgy]{5}$/;
const alwaysTrue = ()=>true;
const makeGtest = (template, pattern, fullWord) => {
  if (!pattern.includes('g')) {
    return alwaysTrue;
  }
  if (!pattern.includes('b')) {
    return word => word === template;
  }
  return word => {
    let i = -1;
    while (++i < word.length) {
      if (pattern[i] === 'g' && template[i] !== word[i]) {
        return false;
      }
    }
    return true;
  }
}

const makePaternTest = (word, pattern) => (suffix, prefix) => makePatern(word, prefix + suffix) === pattern

const makeTests = (word, pattern) => {
  const suffixTest = makePaternTest(word, pattern);

  const prefixTest = makeGtest(word.slice(0, 2), pattern.slice(0, 2));
  return [prefixTest, suffixTest];
}
function * makeGuesser (_word, _pattern, dict) {
  const word = _word.toUpperCase();
  const pattern = _pattern.toLowerCase().replace(/[kwx\u{2B1B}\u{2B1C}]/gu, 'b')
    .replace(/\u{1F7E9}/ug, 'g')
    .replace(/\u{1F7E8}/ug, 'y')
    if (!reg.exec(pattern)) {
      throw new Error('pattern should be of form GGYBB')
    }
  if (pattern.toLowerCase() === 'ggggg') {
    yield word;
    return;
  }
  const [ptest, stest] = makeTests(word, pattern);
  if (dict) {
    if (dict === 'short') {
      yield* dictIter(short, ptest, stest);
    } else if (dict === 'long') {
      yield* dictIter(long, ptest, stest);
    }
  } else {
    yield* dictIter(long, ptest, stest);
    yield* dictIter(short, ptest, stest);
  }

}
module.exports = makeGuesser;
