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
  let figmaData;

  // Look for Figma page ITS Assets and store results to figmaData variable
  for (let i = 0; i < data.document.children.length; i++) {
    if (data.document.children[i].name === 'ITS Assets') {
      figmaData = data.document.children[i].children[0].children;
    }
  }

  // console.log(figmaData);

  // Convert RGB values to hex value
  const rgbToHex = (rgb) => {
    // console.log(rgb);
    
    let hex = Math.round(rgb * 255).toString(16);
    if (hex.length < 2) {
      return `0${hex.slice(-2)}`;
    } else {      
      return hex;
    }
  };

  // Store values from API to figmaObj object
  const styleTextElement = (htmlTag, element, hexTextColor) => {
    figmaObj[htmlTag].color = hexTextColor;
    figmaObj[htmlTag].fontSize = `${element.style.fontSize}px`;
    figmaObj[htmlTag].fontFamily = `"${element.style.fontFamily}"`;
  }

  let figmaObj = {
    h1: {color: '', fontSize: '', fontFamily: ''},
    h1Mobile: {color: '', fontSize: '', fontFamily: ''},
    h2: {color: '', fontSize: '', fontFamily: ''},
    h2Mobile: {color: '', fontSize: '', fontFamily: ''},
    h3: {color: '', fontSize: '', fontFamily: ''},
    h3Mobile: {color: '', fontSize: '', fontFamily: ''},
    h4: {color: '', fontSize: '', fontFamily: ''},
    h4Mobile: {color: '', fontSize: '', fontFamily: ''},
    p: {color: '', fontSize: '', fontFamily: ''},
    a: {color: '', fontSize: '', fontFamily: ''},
    buttonPrimary: {background: '', borderRadius: '', color: ''},
    buttonPrimaryHover: {background: '', borderRadius: '', color: ''},
    buttonSecondary: {background: '', borderRadius: '', color: ''},
    buttonSecondaryHover: {background: '', borderRadius: '', color: ''},
    buttonSmall: {background: '', borderRadius: '', color: ''},
    buttonSmallHover: {background: '', borderRadius: '', color: ''},
    colorPrimary: {color: ''},
    colorPrimaryHover: {color: ''},
    colorPrimarySub: {color: ''},
    colorSecondary: {color: ''},
    colorSecondaryHover: {color: ''},
    colorSecondarySub: {color: ''},
    colorAlt: {color: ''},
    colorAltHover: {color: ''},
    colorAltSub: {color: ''}
  };

  figmaData.forEach((element) => {
    let hexTextColor;
    let hexColor;
    let borderRadius;

    console.log(element.name);
    console.log(element.type);
    
    
    // Combine seperate r, g, b key value pairs into a single hex value
    if (element.type === "TEXT") {
      hexTextColor =  `#${rgbToHex(element.fills[0].color.r)}${rgbToHex(element.fills[0].color.g)}${rgbToHex(element.fills[0].color.b)}`;
    }

    if (element.type === "RECTANGLE") {
      hexColor = `#${rgbToHex(element.fills[0].color.r)}${rgbToHex(element.fills[0].color.g)}${rgbToHex(element.fills[0].color.b)}`;
    }

    if (element.type === 'FRAME') {
      if (element.children[0].fills.length > 0) {
        hexColor = `#${rgbToHex(element.children[0].fills[0].color.r)}${rgbToHex(element.children[0].fills[0].color.g)}${rgbToHex(element.children[0].fills[0].color.b)}`;
      } else {
        hexColor = 'none';
      }

      if (element.children[1].fills.length > 0) {
        hexTextColor = `#${rgbToHex(element.children[1].fills[0].color.r)}${rgbToHex(element.children[1].fills[0].color.g)}${rgbToHex(element.children[1].fills[0].color.b)}`;
      }
    }

    if (element.type === 'COMPONENT') {
      if (element.children[0].fills.length > 0) {
        hexColor = `#${rgbToHex(element.children[0].fills[0].color.r)}${rgbToHex(element.children[0].fills[0].color.g)}${rgbToHex(element.children[0].fills[0].color.b)}`;
      } else {
        hexColor = 'none';
      }

      if (element.children[1].fills.length > 0) {
        hexTextColor = `#${rgbToHex(element.children[1].fills[0].color.r)}${rgbToHex(element.children[1].fills[0].color.g)}${rgbToHex(element.children[1].fills[0].color.b)}`;
      }
    }

    // Run styleElement function on each element depending on name value
    switch(element.name) {
      case 'h1':
        styleTextElement('h1', element, hexTextColor)
        break;
      case 'h1--mobile':
        styleTextElement('h1Mobile', element, hexTextColor)
        break;
      case 'h2':
        styleTextElement('h2', element, hexTextColor)
        break;
      case 'h2--mobile':
        styleTextElement('h2Mobile', element, hexTextColor)
        break;
      case 'h3':
        styleTextElement('h3', element, hexTextColor)
        break;
      case 'h3--mobile':
        styleTextElement('h3Mobile', element, hexTextColor)
        break;
      case 'h4':
        styleTextElement('h4', element, hexTextColor)
        break;
      case 'h4--mobile':
        styleTextElement('h4Mobile', element, hexTextColor)
        break;
      case 'p':
        styleTextElement('p', element, hexTextColor)
        break;
      case 'a':
        styleTextElement('a', element, hexTextColor)
        break;
      case 'primary--default':
        figmaObj.buttonPrimary.background = hexColor;
        figmaObj.buttonPrimary.color = hexTextColor;
        if (element.children[0].cornerRadius) {
          figmaObj.buttonPrimary.borderRadius = `${element.children[0].cornerRadius}px`;
        } else {
          figmaObj.buttonPrimary.borderRadius = '0px';
        }
        
        break;
      case 'primary--hover':
        figmaObj.buttonPrimaryHover.background = hexColor;
        figmaObj.buttonPrimaryHover.color = hexTextColor;
        if (element.children[0].cornerRadius) {
          figmaObj.buttonPrimaryHover.borderRadius = `${element.children[0].cornerRadius}px`;        
        } else {
          figmaObj.buttonPrimaryHover.borderRadius = '0px';
        }
        break;
      case 'secondary--default':
        figmaObj.buttonSecondary.background = hexColor;
        figmaObj.buttonSecondary.color = hexTextColor;
        if (element.children[0].cornerRadius) {
          figmaObj.buttonSecondary.borderRadius = `${element.children[0].cornerRadius}px`;          
        } else {
          figmaObj.buttonSecondary.borderRadius = '0px';
        }
        break;
      case 'secondary--hover':
        figmaObj.buttonSecondaryHover.background = hexColor;
        figmaObj.buttonSecondaryHover.color = hexTextColor;
        if (element.children[0].cornerRadius) {
          figmaObj.buttonSecondaryHover.borderRadius = `${element.children[0].cornerRadius}px`;        
        } else {
          figmaObj.buttonSecondaryHover.borderRadius = '0px';
        }
        break;
      case 'small--default':
        figmaObj.buttonSmall.background = hexColor;
        figmaObj.buttonSmall.color = hexTextColor;
        if (element.children[0].cornerRadius) {
          figmaObj.buttonSmall.borderRadius = `${element.children[0].cornerRadius}px`;
        } else {
          figmaObj.buttonSmall.borderRadius = '0px';
        }
        break;
      case 'small--hover':
        figmaObj.buttonSmallHover.background = hexColor;
        figmaObj.buttonSmallHover.color = hexTextColor;
        if (element.children[0].cornerRadius) {
          figmaObj.buttonSmallHover.borderRadius = `${element.children[0].cornerRadius}px`;
        } else {
          figmaObj.buttonSmallHover.borderRadius = '0px';
        }
        break;
      case '$color-primary':
        figmaObj.colorPrimary.color = hexColor;
        break;
      case '$color-primary--hover':
        figmaObj.colorPrimaryHover.color = hexColor;
        break;
      case '$color-primary--sub':
        figmaObj.colorPrimarySub.color = hexColor;
        break;
      case '$color-secondary':
        figmaObj.colorSecondary.color = hexColor;
        break;
      case '$color-secondary--hover':
        figmaObj.colorSecondaryHover.color = hexColor;
        break;
      case '$color-secondary--sub':
        figmaObj.colorSecondarySub.color = hexColor;
        break;
      case '$color-alt':
        figmaObj.colorAlt.color = hexColor;
        break;
      case '$color-alt--hover':
        figmaObj.colorAltHover.color = hexColor;
        break;
      case '$color-alt--sub':
        figmaObj.colorAltSub.color = hexColor;
        break;
    }
  });

// What gets written to the new SCSS file generated
let figmaSCSS = `
// Figma JSON to SCSS!
h1 {
  color: ${figmaObj.h1.color};
  font-size: ${figmaObj.h1Mobile.fontSize};
  font-family: ${figmaObj.h1.fontFamily};

  @include breakpoint("medium") {// 801px and up
    font-size: ${figmaObj.h1.fontSize};
  }
}

h2 {
  color: ${figmaObj.h2.color};
  font-size: ${figmaObj.h2Mobile.fontSize};
  font-family: ${figmaObj.h2.fontFamily};

  @include breakpoint("medium") {// 801px and up
    font-size: ${figmaObj.h2.fontSize};
  }
}

h3 {
  color: ${figmaObj.h3.color};
  font-size: ${figmaObj.h3Mobile.fontSize};
  font-family: ${figmaObj.h3.fontFamily};

  @include breakpoint("medium") {// 801px and up
    font-size: ${figmaObj.h3.fontSize};
  }
}

h4 {
  color: ${figmaObj.h4.color};
  font-size: ${figmaObj.h4Mobile.fontSize};
  font-family: ${figmaObj.h4.fontFamily};

  @include breakpoint("medium") {// 801px and up
    font-size: ${figmaObj.h4.fontSize};
  }
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
}

.button--primary {
  background: ${figmaObj.buttonPrimary.background};
  border-radius: ${figmaObj.buttonPrimary.borderRadius};
  color: ${figmaObj.buttonPrimary.color};

  &:hover,
  &:active,
  &:focus {
    background: ${figmaObj.buttonPrimaryHover.background};
    color: ${figmaObj.buttonPrimaryHover.color};
  }
}

.button--secondary {
  background: ${figmaObj.buttonSecondary.background};
  border-radius: ${figmaObj.buttonSecondary.borderRadius};
  color: ${figmaObj.buttonSecondary.color};

  &:hover,
  &:active,
  &:focus {
    background: ${figmaObj.buttonSecondaryHover.background};
    color: ${figmaObj.buttonSecondaryHover.color};
  }
}

.card-figcaption-button {
  background: ${figmaObj.buttonSmall.background};
  border-radius: ${figmaObj.buttonSmall.borderRadius};
  color: ${figmaObj.buttonSmall.color};

  &:hover,
  &:active,
  &:focus {
    background: ${figmaObj.buttonSmallHover.background};
    color: ${figmaObj.buttonSmallHover.color};
  }
}

$color-primary: ${figmaObj.colorPrimary.color};
$color-primary--hover: ${figmaObj.colorPrimaryHover.color};
$color-primary--sub: ${figmaObj.colorPrimarySub.color};

$color-secondary: ${figmaObj.colorSecondary.color};
$color-secondary--hover: ${figmaObj.colorSecondaryHover.color};
$color-secondary--sub: ${figmaObj.colorSecondarySub.color};

$color-alt: ${figmaObj.colorAlt.color};
$color-alt--hover: ${figmaObj.colorAltHover.color};
$color-alt--sub: ${figmaObj.colorAltSub.color};
`.trim();

// Write new file to current directory

  fs.writeFile('figmaJSON.scss', figmaSCSS, function (err) {
    if (err) throw err;
    console.log('Saved!');
    process.exit();
  });

}).catch(err => {
  throw err;
  process.exit();
});
