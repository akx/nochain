function blather(minN = 30, maxN = 50, vowels = "aeiou", consonants = "pbn", separators = [". ", "! ", "? ", " ", " "]) {
  let s = "";
  const n = Math.floor(minN + Math.random() * (maxN - minN));
  while (s.length < n) {
    const consonant = consonants[Math.floor(Math.random() * consonants.length)];
    const vowel = vowels[Math.floor(Math.random() * vowels.length)];
    s += consonant;
    s += vowel;
    if (Math.random() < 0.3) s += vowel;
    if (Math.random() < 0.3) {
      s += separators[Math.floor(Math.random() * separators.length)];
    }
  }
  return s.trim();
}

module.exports = blather;
