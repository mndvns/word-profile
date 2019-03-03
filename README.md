# word-profile

Takes an english word and returns its phoneme, syllables, parts of speech, and its difficulty to pronounce.

## Usage

```
import word from word'

word('stuff')
```

yields

```
{
  word: 'stuff',
  phones: [ 'fricative', 'stop', 1, 'vowel', 'fricative' ],
  phoneme: 'S T AH1 F',
  syllables: 1,
  speechlong: [ 'verb_participle', 'verb_intransitive', 'noun' ],
  speechsymbol: 'ViN',
  pronounceable: 0.014783134513484925
}
```
