//Load HTTP module
const http = require("http");
const hostname = '127.0.0.1';
const port = 3000;
const Figma = require('./node_modules/figma-js');
const fs = require('fs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

require('dotenv').config();

const server = http.createServer((req, res) => {

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log('FigmaJSON Scraper Activated');
});


const client = Figma.Client({
  personalAccessToken: process.env.TOKEN
});


client.file(process.env.TEST_FIGMA).then(({ data }) => {
  let figmaData = data.document.children[0].children[0].children;
  let buttonCSS = null;

  function rgbToHex(rgb) {
    let hex = (rgb * 255).toString(16);
    if (hex.length < 2) {
      return `0${hex.slice(-2)}`;
    } else {
      console.log(hex);
      return hex;
    }
  };

  figmaData.forEach(element => {
    if (element.name === '.button') {
      buttonCSS = `${element.name} {
  border-radius: ${element.children[0].cornerRadius};
  background: #${rgbToHex(element.children[0].fills[0].color.r)}${rgbToHex(element.children[0].fills[0].color.g)}${rgbToHex(element.children[0].fills[0].color.b)};
}
      `;
    }
  });

  fs.appendFile('figmaJSON.scss', buttonCSS, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
  
});


// readline.question(`What's the Figma File ID?`, (id) => {

//   const token = '10986-96289412-e998-4633-9cf5-65ccb2d00102';
//   const testFigma = 'J8JxAMC8CrKl8D9pLaank86C';
//   const fullDesign = 'LtpJ5x1GFfcjps2HJXCK5Tiw;'
//   const client = Figma.Client({
//     personalAccessToken: token
//   });


//   client.file(id).then(({ data }) => {
//     let figma = data.document.children[0].children[0].children;
//     let buttonCSS = null;

//     figma.forEach(element => {
//       if (element.name === '.button') {
//         buttonCSS = `
//   ${element.name} {
//     border-radius: ${element.children[0].cornerRadius};
//   }
//         `;
//       }
//     });

//     fs.appendFile('mynewfile1.css', buttonCSS, function (err) {
//       if (err) throw err;
//       console.log('Saved!');
//     });
    
//   });
// })





