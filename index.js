const {short, long} = require('./words');
function * dictIter(dict, ptest =()=>true, stest=()=>true){
  for (const [prefix, value] of Object.entries(dict)) {
    if (!ptest(prefix)) {
      continue;
    }
    const len = value.length/3;
    let i = -1;
    while (++i < len) {
      const sufix = value.slice(i*3, (i+1)*3);
      if (stest(sufix, prefix)) {
        yield prefix+sufix;
      }
    }
  }
}
const reg = /^[bgy]{5}$/;
const alwaysTrue = ()=>true;
const makeGtest = (template, pattern, fullWord, needCheck) => {
  if (!pattern.includes('g')) {
    if (needCheck) {
      return (suffix, prefix) => (prefix + suffix) !== fullWord
    }
    return alwaysTrue;
  }
  if (!pattern.includes('b')) {
    if (needCheck) {
      return (suffix, prefix) => suffix === template && (prefix + suffix) !== fullWord
    }
    return word => word === template;
  }
  if (needCheck) {
    return (word, prefix) => {
      let i = -1;
      while (++i < word.length) {
        if (pattern[i] === 'g' && template[i] !== word[i]) {
          return false;
        }
      }
      return (prefix + word) !== fullWord;
    }
  }
  return word => {
    let i = -1;
    while (++i < word.length) {
      if ('b', pattern[i] === 'g' && template[i] !== word[i]) {
        return false;
      }
    }
    return true;
  }
}
const makeYtest = (template, pattern, isPrefix) => {
  const ourPattern = isPrefix? pattern.slice(0, 2) : pattern.slice(2);
  const ourTemplate =  isPrefix? template.slice(0, 2) : template.slice(2);
  const black = new Set();
  const yellow = new Set()
  let i = -1;
  while (++i < pattern.length) {
    if (pattern[i] === 'b') {
      black.add(template[i])
    }
    if (pattern[i] === 'y') {
      yellow.add(template[i])
    }
  }
  let checkG;
  if (isPrefix) {
      return (word) => {
        let i = -1;
        while (++i < ourPattern.length) {
          if (ourPattern[i] === 'g') {
            if (ourTemplate[i] !== word[i]) {
              return false;
            }
            continue;
          }
          if (ourPattern[i] === 'y') {
            if (ourTemplate[i] === word[i]) {
              return false;
            }
            if (!black.has(word[i]) && !yellow.has(word[i])) {
              return false;
            }
          }
        }
        return true;

    }
  }
  return (word, prefix) => {
    let i = -1;
    while (++i < ourPattern.length) {
      if (ourPattern[i] === 'g') {
        if (ourTemplate[i] !== word[i]) {
          return false;
        }
        continue;
      }
      if (ourPattern[i] === 'y') {
        if (ourTemplate[i] === word[i]) {
          return false;
        }
        if (!black.has(word[i]) && !yellow.has(word[i])) {
          return false;
        }
      }
    }
    i = -1;
    const full = prefix + word;
    const letters = new Set();
    const yellGuess = new Set();
    while (++i < pattern.length) {
      if (pattern[i] !== 'g') {
        letters.add(template[i])
      }
      if (pattern[i] === 'y') {
        yellGuess.add(full[i])
      }
    }
    for (const letter of yellGuess){
      if (!letters.has(letter)) {
        return false;
      }
    }
    return full !== template;
  }
}
const makeTests = (_word, _pattern) => {
  let suffixTest, prefixTest;
  const word = _word.toUpperCase();
  const pattern = _pattern.toLowerCase().replace(/[w\u{2B1B}\u{2B1C}]/gu, 'b')
    .replace(/\u{1F7E9}/ug, 'g')
    .replace(/\u{1F7E8}/ug, 'y')
  if (!reg.exec(pattern)) {
    throw new Error('pattern should be of form GGYBB')
  }
  if (!pattern.includes('y')) {
    prefixTest = makeGtest(word.slice(0, 2), pattern.slice(0, 2), word);
    suffixTest = makeGtest(word.slice(2), pattern.slice(2), word, true);
  } else {
    prefixTest = makeYtest(word, pattern, true);
    suffixTest = makeYtest(word, pattern, false);
  }
  return [prefixTest, suffixTest];
}
function * makeGuesser (word, pattern) {
  if (pattern.toLowerCase() === 'ggggg') {
    yield word;
    return;
  }
  const [ptest, stest] = makeTests(word, pattern);
  yield* dictIter(short, ptest, stest);
  yield* dictIter(long, ptest, stest);
}
module.exports = makeGuesser;
