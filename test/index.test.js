const { default: lib } = require(`../lib/index.js`)

console.clear()

describe('word-profile', () => (
  it('\'stuff\' should work', () => {
    lib('stuff').should.equal({
      word: 'stuff',
      phones: [ 'fricative', 'stop', 1, 'vowel', 'fricative' ],
      phoneme: 'S T AH1 F',
      syllables: 1,
      speechlong: [ 'verb_participle', 'verb_intransitive', 'noun' ],
      speechsymbol: 'ViN',
      pronounceable: 0.014783134513484925
    })
  })
))
