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

  function rgbToHex(rgb) {
    let hex = (rgb * 255).toString(16);
    if (hex.length < 2) {
      return `0${hex.slice(-2)}`;
    } else {
      console.log(hex);
      return hex;
    }
  };

  let figmaObj = {
    h1: {color: '', fontSize: '', fontFamily: ''},
    h2: {color: '', fontSize: '', fontFamily: ''},
    h3: {color: '', fontSize: '', fontFamily: ''},
    h4: {color: '', fontSize: '', fontFamily: ''},
    h5: {color: '', fontSize: '', fontFamily: ''},
    h6: {color: '', fontSize: '', fontFamily: ''},
    p: {color: '', fontSize: '', fontFamily: ''},
    a: {color: '', fontSize: '', fontFamily: ''},
    buttonPrimary: {background: '', borderRadius: ''},
    buttonSecondary: {background: '', borderRadius: ''}
  };

  figmaData.forEach(element => {
    console.log(element.name);

    if (element.name === '.button--primary') {
      let hexColor =  `#${rgbToHex(element.children[0].fills[0].color.r)}${rgbToHex(element.children[0].fills[0].color.g)}${rgbToHex(element.children[0].fills[0].color.b)}`;

      figmaObj.buttonPrimary.background = hexColor;
      figmaObj.buttonPrimary.borderRadius = `${element.children[0].cornerRadius}px`;
    }

    if (element.name === '.button--secondary') {
      let hexColor =  `#${rgbToHex(element.children[0].fills[0].color.r)}${rgbToHex(element.children[0].fills[0].color.g)}${rgbToHex(element.children[0].fills[0].color.b)}`;

      figmaObj.buttonSecondary.background = hexColor;

      if (element.children[0].cornerRadius) {
        figmaObj.buttonSecondary.borderRadius = `${element.children[0].cornerRadius}px`;
      } else {
        figmaObj.buttonSecondary.borderRadius = `0px`;
      }
    }

    if (element.name == 'h1') {
      let hexTextColor =  `#${rgbToHex(element.fills[0].color.r)}${rgbToHex(element.fills[0].color.g)}${rgbToHex(element.fills[0].color.b)}`;
      figmaObj.h1.color = hexTextColor;
      figmaObj.h1.fontSize = `${element.style.fontSize}px`;
      figmaObj.h1.fontFamily = `"${element.style.fontFamily}"`;
    }

    if (element.name == 'h2') {
      let hexTextColor =  `#${rgbToHex(element.fills[0].color.r)}${rgbToHex(element.fills[0].color.g)}${rgbToHex(element.fills[0].color.b)}`;
      figmaObj.h2.color = hexTextColor;
      figmaObj.h2.fontSize = `${element.style.fontSize}px`;
      figmaObj.h2.fontFamily = `"${element.style.fontFamily}"`;
    }

    if (element.name == 'h3') {
      let hexTextColor =  `#${rgbToHex(element.fills[0].color.r)}${rgbToHex(element.fills[0].color.g)}${rgbToHex(element.fills[0].color.b)}`;
      figmaObj.h3.color = hexTextColor;
      figmaObj.h3.fontSize = `${element.style.fontSize}px`;
      figmaObj.h3.fontFamily = `"${element.style.fontFamily}"`;
    }
    

    if (element.name == 'h4') {
      let hexTextColor =  `#${rgbToHex(element.fills[0].color.r)}${rgbToHex(element.fills[0].color.g)}${rgbToHex(element.fills[0].color.b)}`;
      figmaObj.h4.color = hexTextColor;
      figmaObj.h4.fontSize = `${element.style.fontSize}px`;
      figmaObj.h4.fontFamily = `"${element.style.fontFamily}"`;
    }

    if (element.name == 'h5') {
      let hexTextColor =  `#${rgbToHex(element.fills[0].color.r)}${rgbToHex(element.fills[0].color.g)}${rgbToHex(element.fills[0].color.b)}`;
      figmaObj.h5.color = hexTextColor;
      figmaObj.h5.fontSize = `${element.style.fontSize}px`;
      figmaObj.h5.fontFamily = `"${element.style.fontFamily}"`;
    }

    if (element.name == 'h6') {
      let hexTextColor =  `#${rgbToHex(element.fills[0].color.r)}${rgbToHex(element.fills[0].color.g)}${rgbToHex(element.fills[0].color.b)}`;
      figmaObj.h6.color = hexTextColor;
      figmaObj.h6.fontSize = `${element.style.fontSize}px`;
      figmaObj.h6.fontFamily = `"${element.style.fontFamily}"`;
    }

    if (element.name == 'p') {
      let hexTextColor =  `#${rgbToHex(element.fills[0].color.r)}${rgbToHex(element.fills[0].color.g)}${rgbToHex(element.fills[0].color.b)}`;
      figmaObj.p.color = hexTextColor;
      figmaObj.p.fontSize = `${element.style.fontSize}px`;
      figmaObj.p.fontFamily = `"${element.style.fontFamily}"`;
    }

    if (element.name == 'a') {
      let hexTextColor =  `#${rgbToHex(element.fills[0].color.r)}${rgbToHex(element.fills[0].color.g)}${rgbToHex(element.fills[0].color.b)}`;
      figmaObj.a.color = hexTextColor;
      figmaObj.a.fontSize = `${element.style.fontSize}px`;
      figmaObj.a.fontFamily = `"${element.style.fontFamily}"`;
    }

  });



  let figmaSCSS = `// Figma JSON to SCSS
.h1 {
  color: ${figmaObj.h1.color};
  font-size: ${figmaObj.h1.fontSize};
  font-family: ${figmaObj.h1.fontFamily};
}

.h2 {
  color: ${figmaObj.h2.color};
  font-size: ${figmaObj.h2.fontSize};
  font-family: ${figmaObj.h2.fontFamily};
}

.h3 {
  color: ${figmaObj.h3.color};
  font-size: ${figmaObj.h3.fontSize};
  font-family: ${figmaObj.h3.fontFamily};
}

.h4 {
  color: ${figmaObj.h4.color};
  font-size: ${figmaObj.h4.fontSize};
  font-family: ${figmaObj.h4.fontFamily};
}

.h5 {
  color: ${figmaObj.h5.color};
  font-size: ${figmaObj.h5.fontSize};
  font-family: ${figmaObj.h5.fontFamily};
}

.h6 {
  color: ${figmaObj.h6.color};
  font-size: ${figmaObj.h6.fontSize};
  font-family: ${figmaObj.h6.fontFamily};
}

.button--primary {
  background: ${figmaObj.buttonPrimary.background};
  border-radius: ${figmaObj.buttonPrimary.borderRadius};
}

.button--secondary {
  background: ${figmaObj.buttonSecondary.background};
  border-radius: ${figmaObj.buttonSecondary.borderRadius};
}
`;

  fs.appendFile('figmaJSON.scss', figmaSCSS, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
  
});

// readline.question(`What's the Figma File ID?`, (id) => {

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





