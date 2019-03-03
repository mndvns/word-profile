"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pronounceable_1 = __importDefault(require("pronounceable"));
var fs_1 = __importDefault(require("fs"));
var partsDict = fs_1.default.readFileSync(__dirname + "/../etc/mobypos.txt", 'utf8').split('\n');
var partsCache = {};
for (var line in partsDict) {
    var _a = partsDict[line].split(/\\/), a = _a[0], b = _a[1];
    partsCache[a] = (b && b.trim());
}
var partsLegend = {
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
};
var phonesDict = fs_1.default.readFileSync(__dirname + "/../etc/cmudict-0.7b", 'utf8').split('\n');
var phonesCache = {};
for (var line in phonesDict) {
    var _b = phonesDict[line].split(/  /), a = _b[0], b = _b[1];
    phonesCache[a] = (b && b.trim());
}
var phonesLegend = {
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
};
function phonemeToPhones(phoneme) {
    var syllables = 0;
    var symbols = phoneme.split(' ');
    var phones = symbols.reduce(function (acc, phone) {
        var match;
        if (match = /(.*)?(\d)(.*)?/.exec(phone)) {
            var stress = parseInt(match[2]);
            if (typeof stress !== 'number')
                throw new Error("found invalid phone '" + phone + "' in phoneme '" + phoneme + "'");
            acc.push(stress);
            syllables++;
            phone = (match[1] || '') + (match[3] || '');
        }
        acc.push(phonesLegend[phone]);
        return acc;
    }, []);
    return {
        phones: phones,
        symbols: symbols,
        syllables: syllables,
    };
}
function default_1(word) {
    word = word.trim();
    var phoneme = phonesCache[word.toUpperCase()];
    var speechsymbol = (partsCache[word] || partsCache[word.toLowerCase()]);
    if (!phoneme)
        throw new Error("word '" + word + "' phoeneme not found");
    if (!speechsymbol)
        throw new Error("word '" + word + "' parts of speech not found");
    var _a = phonemeToPhones(phoneme), phones = _a.phones, syllables = _a.syllables;
    var speechlong = speechsymbol.split('').map(function (s) { return partsLegend[s]; });
    var pronounceable = pronounceable_1.default.score(word);
    return {
        word: word,
        phones: phones,
        phoneme: phoneme,
        syllables: syllables,
        speechlong: speechlong,
        speechsymbol: speechsymbol,
        pronounceable: pronounceable,
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map