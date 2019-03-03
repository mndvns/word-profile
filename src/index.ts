import Pronounceable from 'pronounceable'
import fs from 'fs'

const partsDict = fs.readFileSync(`${__dirname}/../etc/mobypos.txt`, 'utf8').split('\n')
const partsCache = {};
for (let line in partsDict) {
  const [a, b] = partsDict[line].split(/\\/);
  partsCache[a] = (b && b.trim())
}
const partsLegend = {
  'N': 'noun',
  'p': 'plural',
  'h': 'noun_phrase',
  'V': 'verb_participle',
  't': 'verb_transitive',
  'i': 'verb_intransitive',
  'A': 'adjective',
  'v': 'adverb',
  'C': 'conjunction',
  'P': 'preposition',
  '!': 'interjection',
  'r': 'pronoun',
  'D': 'definite article',
  'I': 'indefinite article',
  'o': 'nominative',
}

const phonesDict = fs.readFileSync(`${__dirname}/../etc/cmudict-0.7b`, 'utf8').split('\n')
const phonesCache = {};
for (let line in phonesDict) {
  const [a, b] = phonesDict[line].split(/  /);
  phonesCache[a] = (b && b.trim())
}
const phonesLegend = {
  'AA': 'vowel',
  'AE': 'vowel',
  'AH': 'vowel',
  'AO': 'vowel',
  'AW': 'vowel',
  'AY': 'vowel',
  'B': 'stop',
  'CH': 'affricate',
  'D': 'stop',
  'DH': 'fricative',
  'EH': 'vowel',
  'ER': 'vowel',
  'EY': 'vowel',
  'F': 'fricative',
  'G': 'stop',
  'HH': 'aspirate',
  'IH': 'vowel',
  'IY': 'vowel',
  'JH': 'affricate',
  'K': 'stop',
  'L': 'liquid',
  'M': 'nasal',
  'N': 'nasal',
  'NG': 'nasal',
  'OW': 'vowel',
  'OY': 'vowel',
  'P': 'stop',
  'R': 'liquid',
  'S': 'fricative',
  'SH': 'fricative',
  'T': 'stop',
  'TH': 'fricative',
  'UH': 'vowel',
  'UW': 'vowel',
  'V': 'fricative',
  'W': 'semivowel',
  'Y': 'semivowel',
  'Z': 'fricative',
  'ZH': 'fricative',
}

function phonemeToPhones(phoneme: string) {
  let syllables = 0
  const symbols = phoneme.split(' ')
  const phones = symbols.reduce((acc: (string | number)[], phone: string) => {
    let match: any
    if (match = /(.*)?(\d)(.*)?/.exec(phone)) {
      const stress = parseInt(match[2])
      if (typeof stress !== 'number')
        throw new Error(`found invalid phone '${phone}' in phoneme '${phoneme}'`)
      acc.push(stress)
      syllables++
      phone = (match[1] || '') + (match[3] || '')
    }
    acc.push(phonesLegend[phone])
    return acc;
  }, []);
  return {
    phones,
    symbols,
    syllables,
  }
}

export default function(word: string) {
  word = word.trim()
  const phoneme = phonesCache[word.toUpperCase()]
  const speechsymbol = (partsCache[word] || partsCache[word.toLowerCase()])
  if (!phoneme) throw new Error(`word '${word}' phoeneme not found`)
  if (!speechsymbol) throw new Error(`word '${word}' parts of speech not found`)
  const { phones, syllables } = phonemeToPhones(phoneme)
  const speechlong = speechsymbol.split('').map((s: string) => partsLegend[s])
  const pronounceable = Pronounceable.score(word)
  return {
    word,
    phones,
    phoneme,
    syllables,
    speechlong,
    speechsymbol,
    pronounceable,
  }
}
