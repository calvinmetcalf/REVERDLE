const makePatern = (_target, _guess) => {
  const out = ['b', 'b', 'b', 'b', 'b']
  const target = _target.split('');
  const guess = _guess.split('');
  let i = -1;
  while (++i < out.length) {
    if (target[i] === guess[i]) {
      out[i] = 'g';
      target[i] = '';
    }
  }
  i = -1;
  while (++i < out.length) {
    if (out[i] === 'g') {
      continue;
    }
    const idx = target.indexOf(guess[i]);
    if (idx > -1) {
      out[i] = 'y';
      target[idx] = ''
    }
  }
  return out.join('');
}
module.exports = makePatern;
