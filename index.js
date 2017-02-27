const INPUT_FILE = 'script.txt';
const OUTPUT_FILE = 'lines.txt';

const readline = require('readline');
const fs = require('fs');

function isUpperCase(line) {
  return line === line.toUpperCase();
}

const input = readline.createInterface({
  input: fs.createReadStream(INPUT_FILE)
});


const MODE_NORMAL = 'normal';
const MODE_TALKING = 'talking';

var mode = MODE_NORMAL;
var currentLine = '';
var lines = [];

input.on('line', line => {
  line = line.trim();
  if (mode === MODE_NORMAL) {
    if (line.length > 0 && isUpperCase(line)) {
      mode = MODE_TALKING;
    }
  } else if (mode === MODE_TALKING) {
    if (line.length === 0) {
      mode = MODE_NORMAL;
      if (currentLine.length > 0) {
        lines.push(currentLine.trim());
      }
      currentLine = '';
    } else if (line[0] !== '(') {
      currentLine += line + ' ';
    }
  }
});

function getSentences(paragraph) {
  var sentences = [];
  var currentSentence = '';
  var words = paragraph.split(' ');
  let word;
  while (word = words.shift()) {
    if (!word) {
      continue;
    }
    currentSentence += word + ' ';
    if ((word.endsWith('.') || word.endsWith('!') || word.endsWith('?')) &&
        word !== 'Mr.' && word !== 'Mrs.') {
      sentences.push(currentSentence.trim());
      currentSentence = '';
    }
  }
  return sentences;
}

var output = fs.createWriteStream(OUTPUT_FILE);
var finalSentences = [];

input.on('close', () => {
  lines.forEach(line => {
    finalSentences = finalSentences.concat(getSentences(line));
  });
  finalSentences = finalSentences.filter(s => {
    if (s.includes(',') || s.includes('–') || s.includes('..')) {
      return false;
    }

    var spaces = s.split(' ').length - 1;
    if (spaces < 3 || spaces > 10) {
      return false;
    }

    return true;
  });
  finalSentences.forEach(sentence => {
    output.write(sentence + '\n');
  });
  output.end();
});


