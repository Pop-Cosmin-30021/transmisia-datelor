let bitsUtils = require('bits-utils');
let {
  loadWords,
  getCodes,
  getInvertedCodes,
  decodeOneWord,
  encodeOneWord
} = require('../lib/lib');
const chalk = require('chalk');
const fs = require('fs');
const kiwiUrl = 'http://localhost:3001';
const filename = '../lib/common-words.txt';
const words = loadWords(filename);
const codes = getCodes(words);
var Parser = require("binary-parser").Parser;
let { app } = require('./server-config');
let axios = require('axios');


function sendWord(word) {
    const binaryData = encodeOneWord(word, codes);

    fs.appendFile('outputFile.txt', bitsUtils.printBuffer(binaryData) + '\r\n', function (err) {
      if (err) throw err;
      console.log( bitsUtils.printBuffer(binaryData) + ' saved to file!');
    });

  console.log(
    `The binary code for ${chalk.blueBright(word)} is ${chalk.blueBright(
      bitsUtils.printBuffer(binaryData)
    )}`
  );

  console.log(
    `Sending ${chalk.blueBright(
      bitsUtils.printBuffer(binaryData)
    )} to ${chalk.greenBright('kiwi')}`
  );
  axios
    .post(`${kiwiUrl}/compressed`, binaryData, {
      headers: {
        'Content-Type': 'text/html'
      }
    })
    .then(res => {
      console.log(
        `Response from ${chalk.greenBright('kiwi')}: "${res.data.status}"`
      );
    });
}

function sendText(text) {
  axios
    .post(`${kiwiUrl}/text`, text, {
      headers: {
        'Content-Type': 'text/html'
      }
    })
    .then(res => {
      console.log(
        `Response from ${chalk.greenBright('kiwi')}: "${res.data.status}"`
      );
    });
}

function readFile(){
    try {
      const data = fs.readFileSync('inputFile.txt', 'utf8');
      return data.toString();
    } catch (err) {
      console.error(err)
    }
}
sendWord('give');
sendWord('this');
sendWord(' ');
sendWord('\r\n'); //https://stackoverflow.com/questions/1761051/difference-between-n-and-r
sendWord('because');
sendWord('have');

sendText('give');
sendText('this\r\nbecause');

sendText(readFile()+'');