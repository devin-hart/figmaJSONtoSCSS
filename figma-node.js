const http = require("http");
const hostname = '127.0.0.1';
const port = 3000;
const Figma = require('./node_modules/figma-js');
const fs = require('fs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

require('dotenv').config();

// Start server
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log('FigmaJSONtoSCSS Initialized');
});

// Figma-js client
const client = Figma.Client({
  personalAccessToken: process.env.TOKEN
});

// AJAX in Figma API data
client.file(process.env.TEST_FIGMA).then(({ data }) => {
  let figmaData = data.document.children[0].children[0].children;

  // Convert RGB values to hex value
  const rgbToHex = (rgb) => {
    let hex = (rgb * 255).toString(16);
    if (hex.length < 2) {
      return `0${hex.slice(-2)}`;
    } else {
      return hex;
    }
  };

  // Store values from API to figmaObj object
  const styleElement = (htmlTag, element, hexTextColor) => {
    figmaObj[htmlTag].color = hexTextColor;
    figmaObj[htmlTag].fontSize = `${element.style.fontSize}px`;
    figmaObj[htmlTag].fontFamily = `"${element.style.fontFamily}"`;
    if (htmlTag === 'a') {
      figmaObj[htmlTag].textDecoration = `"${element.style.textDecoration.toLowerCase()}"`;
    }
  }

  let figmaObj = {
    h1: {color: '', fontSize: '', fontFamily: ''},
    h2: {color: '', fontSize: '', fontFamily: ''},
    h3: {color: '', fontSize: '', fontFamily: ''},
    h4: {color: '', fontSize: '', fontFamily: ''},
    h5: {color: '', fontSize: '', fontFamily: ''},
    h6: {color: '', fontSize: '', fontFamily: ''},
    p: {color: '', fontSize: '', fontFamily: ''},
    a: {color: '', fontSize: '', fontFamily: '', textDecoration: ''},
    buttonPrimary: {background: '', borderRadius: ''},
    buttonSecondary: {background: '', borderRadius: ''}
  };

  figmaData.forEach((element) => {
    let hexTextColor;
    let hexColor;

    // Combine seperate r, g, b key value pairs into a single hex value
    if (element.fills !== undefined) {
      hexTextColor =  `#${rgbToHex(element.fills[0].color.r)}${rgbToHex(element.fills[0].color.g)}${rgbToHex(element.fills[0].color.b)}`;
    } else {
      hexColor = `#${rgbToHex(element.children[0].fills[0].color.r)}${rgbToHex(element.children[0].fills[0].color.g)}${rgbToHex(element.children[0].fills[0].color.b)}`;
    }

    // Run styleElement function on each element depending on name value
    switch(element.name) {
      case 'h1': 
        styleElement('h1', element, hexTextColor)
        break;
      case 'h2': 
        styleElement('h2', element, hexTextColor)
        break;
      case 'h3': 
        styleElement('h3', element, hexTextColor)
        break;
      case 'h4': 
        styleElement('h4', element, hexTextColor)
        break;
      case 'h5': 
        styleElement('h5', element, hexTextColor)
        break;
      case 'h6': 
        styleElement('h6', element, hexTextColor)
        break;
      case 'p': 
        styleElement('p', element, hexTextColor)
        break;
      case 'a': 
        styleElement('a', element, hexTextColor)
        break;
      case '.button--primary': 
          figmaObj.buttonPrimary.background = hexColor;
          figmaObj.buttonPrimary.borderRadius = `${element.children[0].cornerRadius}px`;
        break;
      case '.button--secondary': 
          figmaObj.buttonSecondary.background = hexColor;

          if (element.children[0].cornerRadius) {
            figmaObj.buttonSecondary.borderRadius = `${element.children[0].cornerRadius}px`;
          } else {
            figmaObj.buttonSecondary.borderRadius = `0px`;
          }
        break;
    }
  });

// What gets written to the new SCSS file generated
let figmaSCSS = `
// Figma JSON to SCSS!
h1 {
  color: ${figmaObj.h1.color};
  font-size: ${figmaObj.h1.fontSize};
  font-family: ${figmaObj.h1.fontFamily};
}

h2 {
  color: ${figmaObj.h2.color};
  font-size: ${figmaObj.h2.fontSize};
  font-family: ${figmaObj.h2.fontFamily};
}

h3 {
  color: ${figmaObj.h3.color};
  font-size: ${figmaObj.h3.fontSize};
  font-family: ${figmaObj.h3.fontFamily};
}

h4 {
  color: ${figmaObj.h4.color};
  font-size: ${figmaObj.h4.fontSize};
  font-family: ${figmaObj.h4.fontFamily};
}

h5 {
  color: ${figmaObj.h5.color};
  font-size: ${figmaObj.h5.fontSize};
  font-family: ${figmaObj.h5.fontFamily};
}

h6 {
  color: ${figmaObj.h6.color};
  font-size: ${figmaObj.h6.fontSize};
  font-family: ${figmaObj.h6.fontFamily};
}

p {
  color: ${figmaObj.p.color};
  font-size: ${figmaObj.p.fontSize};
  font-family: ${figmaObj.p.fontFamily};
}

a {
  color: ${figmaObj.a.color};
  font-size: ${figmaObj.a.fontSize};
  font-family: ${figmaObj.a.fontFamily};
  text-decoration: ${figmaObj.a.textDecoration.toLowerCase()};
}

.button--primary {
  background: ${figmaObj.buttonPrimary.background};
  border-radius: ${figmaObj.buttonPrimary.borderRadius};
}

.button--secondary {
  background: ${figmaObj.buttonSecondary.background};
  border-radius: ${figmaObj.buttonSecondary.borderRadius};
}
`.trim();

// Write new file to current directory
  fs.appendFile('figmaJSON.scss', figmaSCSS, function (err) {
    if (err) throw err;
    console.log('Saved!');
    process.exit();
  });
  
}).catch(err => {
  throw err;
  process.exit();
});;


// ************** //
// For future use //
// ************** /

// readline.question(`What's the Figma File ID?`, (id) => {
//   const client = Figma.Client({
//     personalAccessToken: token
//   });

//   client.file(id).then(({ data }) => {
//     let figma = data.document.children[0].children[0].children;
//     let buttonCSS = null;

//     figma.forEach(element => {
//       if (element.name === '.button') {

//       }
//     });

//     fs.appendFile('mynewfile1.css', buttonCSS, function (err) {
//       if (err) throw err;
//       console.log('Saved!');
//     });    
//   });
// })
