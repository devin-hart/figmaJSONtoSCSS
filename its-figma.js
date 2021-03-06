const Figma = require('figma-js');
const fs = require('fs');
const prependFile = require('prepend-file');

require('dotenv').config();

console.log(`
███████╗██╗ ██████╗ ███╗   ███╗ █████╗ 
██╔════╝██║██╔════╝ ████╗ ████║██╔══██╗
█████╗  ██║██║  ███╗██╔████╔██║███████║
██╔══╝  ██║██║   ██║██║╚██╔╝██║██╔══██║
██║     ██║╚██████╔╝██║ ╚═╝ ██║██║  ██║
╚═╝     ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝
                                       
████████╗ ██████╗ 
╚══██╔══╝██╔═══██╗
   ██║   ██║   ██║
   ██║   ██║   ██║
   ██║   ╚██████╔╝
   ╚═╝    ╚═════╝ 
                  
███████╗ ██████╗███████╗███████╗
██╔════╝██╔════╝██╔════╝██╔════╝
███████╗██║     ███████╗███████╗
╚════██║██║     ╚════██║╚════██║
███████║╚██████╗███████║███████║
╚══════╝ ╚═════╝╚══════╝╚══════╝
`);

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
      figmaData = data.document.children[i].children;
    }
  }

  // Convert RGB values to hex value
  const rgbToHex = (rgb) => {
    let hex = Math.round(rgb * 255).toString(16);
    if (hex.length < 2) {
      return `0${hex.slice(-2)}`;
    } else {      
      return hex;
    }
  };

  // Convert element's height and font-size to padding
  const calcPadding = (htmlTag, elementHeight, fontSize) => {
    figmaObj[htmlTag].padding = `${(elementHeight - fontSize) / 2}px`;
  }

  // Store values from API to figmaObj object
  const styleTextElement = (htmlTag, element, hexTextColor) => {
    figmaObj[htmlTag].color = hexTextColor;
    figmaObj[htmlTag].fontSize = `${element.style.fontSize}px`;
    figmaObj[htmlTag].fontFamily = `"${element.style.fontFamily}"`;
    figmaObj[htmlTag].fontWeight = `${element.style.fontWeight}`;
  }

  const styleButtonElement = (htmlTag, hexColor, hexTextColor, border, borderRadius) => {
    figmaObj[htmlTag].background = hexColor;
    figmaObj[htmlTag].border = border;
    figmaObj[htmlTag].borderRadius = borderRadius;
    figmaObj[htmlTag].color = hexTextColor;
  }

  let figmaObj = {
    h1: {color: 'all', fontSize: 'all', fontFamily: 'all', fontWeight: 'all'},
    h1Mobile: {color: 'all', fontSize: 'all', fontFamily: 'all', fontWeight: 'all'},
    h2: {color: 'all', fontSize: 'all', fontFamily: 'all', fontWeight: 'all'},
    h2Mobile: {color: 'all', fontSize: 'all', fontFamily: 'all', fontWeight: 'all'},
    h3: {color: 'all', fontSize: 'all', fontFamily: 'all', fontWeight: 'all'},
    h3Mobile: {color: 'all', fontSize: 'all', fontFamily: 'all', fontWeight: 'all'},
    h4: {color: 'all', fontSize: 'all', fontFamily: 'all', fontWeight: 'all'},
    h4Mobile: {color: 'all', fontSize: 'all', fontFamily: 'all', fontWeight: 'all'},
    p: {color: 'all', fontSize: 'all', fontFamily: 'all', fontWeight: 'all'},
    a: {color: 'all', fontSize: 'all', fontFamily: 'all', fontWeight: 'all', textDecoration: 'all'},
    aHover: {color: 'all', textDecoration: 'all'},
    input: {background: 'all', border: 'all'},
    inputFocus: {background: 'all', border: 'all'},
    buttonPrimary: {background: 'all', borderRadius: 'all', color: 'all', border: 'all', padding: 'all'},
    buttonPrimaryHover: {background: 'all', borderRadius: 'all', color: 'all'},
    buttonSecondary: {background: 'all', borderRadius: 'all', color: 'all', border: 'all', padding: 'all'},
    buttonSecondaryHover: {background: 'all', borderRadius: 'all', color: 'all'},
    buttonSmall: {background: 'all', borderRadius: 'all', color: 'all', border: 'all', padding: 'all'},
    buttonSmallHover: {background: 'all', borderRadius: 'all', color: 'all'},
    icon: {fill: 'all', height: 'all', width: 'all'},
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
    let border;
    let borderRadius;

    console.log(element.name);
    console.log(element.type);
    
    if (element.type === "TEXT") {
      hexTextColor =  `#${rgbToHex(element.fills[0].color.r)}${rgbToHex(element.fills[0].color.g)}${rgbToHex(element.fills[0].color.b)}`;
    }

    if (element.type === "RECTANGLE") {
      if (element.fills.length > 0) {
        hexColor = `#${rgbToHex(element.fills[0].color.r)}${rgbToHex(element.fills[0].color.g)}${rgbToHex(element.fills[0].color.b)}`;
      } else {
        hexColor = 'none';
      }

      if (element.strokes.length > 0) {
        border = `${element.strokeWeight}px solid #${rgbToHex(element.strokes[0].color.r)}${rgbToHex(element.strokes[0].color.g)}${rgbToHex(element.strokes[0].color.b)}`
      } else {
        border = 'none';
      }

      if (element.cornerRadius) {
        borderRadius = `${element.cornerRadius}px`;
      } else {
        borderRadius = '0px';
      }
    }

    if (element.type === 'FRAME') {
      if (element.children[0].fills.length > 0) {
        hexColor = `#${rgbToHex(element.children[0].fills[0].color.r)}${rgbToHex(element.children[0].fills[0].color.g)}${rgbToHex(element.children[0].fills[0].color.b)}`;
      } else {
        hexColor = 'none';
      }

      if (element.children[0].cornerRadius) {
        borderRadius = `${element.children[0].cornerRadius}px`;
      } else {
        borderRadius = '0px';
      }

      if (element.children[0].strokes.length > 0) {
        border = `${element.children[0].strokeWeight}px solid #${rgbToHex(element.children[0].strokes[0].color.r)}${rgbToHex(element.children[0].strokes[0].color.g)}${rgbToHex(element.children[0].strokes[0].color.b)}`
      } else {
        border = 'none';
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

      if (element.children[0].strokes.length > 0) {
        border = `${element.children[0].strokeWeight}px solid #${rgbToHex(element.children[0].strokes[0].color.r)}${rgbToHex(element.children[0].strokes[0].color.g)}${rgbToHex(element.children[0].strokes[0].color.b)}`
      } else {
        border = 'none';
      }

      if (element.children[0].cornerRadius) {
        borderRadius = `${element.children[0].cornerRadius}px`;
      } else {
        borderRadius = '0px';
      }

      if (element.children[1].fills.length > 0) {
        hexTextColor = `#${rgbToHex(element.children[1].fills[0].color.r)}${rgbToHex(element.children[1].fills[0].color.g)}${rgbToHex(element.children[1].fills[0].color.b)}`;
      }
    }

    if (element.type === 'VECTOR') {
      if (element.fills.length > 0) {
        hexColor = `#${rgbToHex(element.fills[0].color.r)}${rgbToHex(element.fills[0].color.g)}${rgbToHex(element.fills[0].color.b)}`;
      } else {
        hexColor = 'none';
      }
    }

    // Apply styyyyyyle
    switch(element.name) {
      case 'h1':
        styleTextElement('h1', element, hexTextColor);
        break;
      case 'h1--mobile':
        styleTextElement('h1Mobile', element, hexTextColor);
        break;
      case 'h2':
        styleTextElement('h2', element, hexTextColor);
        break;
      case 'h2--mobile':
        styleTextElement('h2Mobile', element, hexTextColor);
        break;
      case 'h3':
        styleTextElement('h3', element, hexTextColor);
        break;
      case 'h3--mobile':
        styleTextElement('h3Mobile', element, hexTextColor);
        break;
      case 'h4':
        styleTextElement('h4', element, hexTextColor);
        break;
      case 'h4--mobile':
        styleTextElement('h4Mobile', element, hexTextColor);
        break;
      case 'p':
        styleTextElement('p', element, hexTextColor);
        break;
      case 'a':
        styleTextElement('a', element, hexTextColor);
        if (element.style.textDecoration) {
          figmaObj.a.textDecoration = element.style.textDecoration.toLowerCase();
        } else {
          figmaObj.a.textDecoration = 'none';
        }
        break;
      case 'a--hover':
        if (element.style.textDecoration) {
          figmaObj.aHover.textDecoration = element.style.textDecoration.toLowerCase();
        } else {
          figmaObj.aHover.textDecoration = 'none';
        }

        figmaObj.aHover.color = hexTextColor;
        break;
      case 'input--default':
        figmaObj.input.background = hexColor;
        figmaObj.input.border = border;
        figmaObj.input.borderRadius = borderRadius;
        break;
      case 'input--focused':
        figmaObj.inputFocus.background = hexColor;
        figmaObj.inputFocus.border = border;
        figmaObj.inputFocus.borderRadius = borderRadius;
        break;
      case 'primary--default':
        styleButtonElement('buttonPrimary', hexColor, hexTextColor, border, borderRadius);
        calcPadding('buttonPrimary', element.children[0].absoluteBoundingBox.height, element.children[1].style.fontSize);
        break;
      case 'primary--hover':
        styleButtonElement('buttonPrimaryHover', hexColor, hexTextColor, border, borderRadius);
        break;
      case 'secondary--default':
        styleButtonElement('buttonSecondary', hexColor, hexTextColor, border, borderRadius);
        calcPadding('buttonSecondary', element.children[0].absoluteBoundingBox.height, element.children[1].style.fontSize);
        break;
      case 'secondary--hover':
        styleButtonElement('buttonSecondaryHover', hexColor, hexTextColor, border, borderRadius);
        break;
      case 'small--default':
        styleButtonElement('buttonSmall', hexColor, hexTextColor, border, borderRadius);
        calcPadding('buttonSmall', element.children[0].absoluteBoundingBox.height, element.children[1].style.fontSize);
        break;
      case 'small--hover':
        styleButtonElement('buttonSmallHover', hexColor, hexTextColor, border, borderRadius);
        break;
      case 'icon':
        figmaObj.icon.fill = hexColor;
        figmaObj.icon.height = `${element.absoluteBoundingBox.height}px`;
        figmaObj.icon.width = `${element.absoluteBoundingBox.width}px`;
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

$color-primary: ${figmaObj.colorPrimary.color};
$color-primary--hover: ${figmaObj.colorPrimaryHover.color};
$color-primary--sub: ${figmaObj.colorPrimarySub.color};

$color-secondary: ${figmaObj.colorSecondary.color};
$color-secondary--hover: ${figmaObj.colorSecondaryHover.color};
$color-secondary--sub: ${figmaObj.colorSecondarySub.color};

$color-alt: ${figmaObj.colorAlt.color};
$color-alt--hover: ${figmaObj.colorAltHover.color};
$color-alt--sub: ${figmaObj.colorAltSub.color};

h1 {
  color: ${figmaObj.h1.color};
  font-size: ${figmaObj.h1Mobile.fontSize};
  font-family: ${figmaObj.h1.fontFamily};
  font-weight: ${figmaObj.h1.fontWeight};

  @include breakpoint("medium") {// 801px and up
    font-size: ${figmaObj.h1.fontSize};
  }
}


h2 {
  color: ${figmaObj.h2.color};
  font-size: ${figmaObj.h2Mobile.fontSize};
  font-family: ${figmaObj.h2.fontFamily};
  font-weight: ${figmaObj.h2.fontWeight};

  @include breakpoint("medium") {// 801px and up
    font-size: ${figmaObj.h2.fontSize};
  }
}

h3 {
  color: ${figmaObj.h3.color};
  font-size: ${figmaObj.h3Mobile.fontSize};
  font-family: ${figmaObj.h3.fontFamily};
  font-weight: ${figmaObj.h3.fontWeight};

  @include breakpoint("medium") {// 801px and up
    font-size: ${figmaObj.h3.fontSize};
  }
}


h4 {
  color: ${figmaObj.h4.color};
  font-size: ${figmaObj.h4Mobile.fontSize};
  font-family: ${figmaObj.h4.fontFamily};
  font-weight: ${figmaObj.h4.fontWeight};

  @include breakpoint("medium") {// 801px and up
    font-size: ${figmaObj.h4.fontSize};
  }
}

p {
  color: ${figmaObj.p.color};
  font-size: ${figmaObj.p.fontSize};
  font-family: ${figmaObj.p.fontFamily};
  font-weight: ${figmaObj.p.fontWeight};
}

a {
  color: ${figmaObj.a.color};
  font-size: ${figmaObj.a.fontSize};
  font-family: ${figmaObj.a.fontFamily};
  font-weight: ${figmaObj.a.fontWeight};
  text-decoration: ${figmaObj.a.textDecoration};

  &:hover,
  &:active,
  &:focus {
    text-decoration: ${figmaObj.aHover.textDecoration};
    color: ${figmaObj.aHover.color};
  }
}

.form-input {
  background: ${figmaObj.input.background};
  border: ${figmaObj.input.border};
  border-radius: ${figmaObj.input.borderRadius};
}

.form-input:focus {
  background: ${figmaObj.inputFocus.background};
  border: ${figmaObj.inputFocus.border};
  border-radius: ${figmaObj.inputFocus.borderRadius};
}

.button.button--primary {
  background: ${figmaObj.buttonPrimary.background};
  border-radius: ${figmaObj.buttonPrimary.borderRadius};
  border: ${figmaObj.buttonPrimary.border};
  padding: ${figmaObj.buttonPrimary.padding};
  color: ${figmaObj.buttonPrimary.color};

  &:hover,
  &:active,
  &:focus {
    background: ${figmaObj.buttonPrimaryHover.background};
    color: ${figmaObj.buttonPrimaryHover.color};
  }
}

.button.button--primary a {
  color: ${figmaObj.buttonPrimary.color};
  
  &:hover,
  &:active,
  &:focus {
    color: ${figmaObj.buttonPrimaryHover.color};
  }
}

.button.button--secondary {
  background: ${figmaObj.buttonSecondary.background};
  border-radius: ${figmaObj.buttonSecondary.borderRadius};
  border: ${figmaObj.buttonSecondary.border};
  color: ${figmaObj.buttonSecondary.color};

  &:hover,
  &:active,
  &:focus {
    background: ${figmaObj.buttonSecondaryHover.background};
    color: ${figmaObj.buttonSecondaryHover.color};
  }
}

.button.button--secondary a {
  color: ${figmaObj.buttonSecondary.color};
  
  &:hover,
  &:active,
  &:focus {
    color: ${figmaObj.buttonSecondaryHover.color};
  }
}

.button.button--small {
  background: ${figmaObj.buttonSmall.background};
  border-radius: ${figmaObj.buttonSmall.borderRadius};
  color: ${figmaObj.buttonSmall.color};
  border: ${figmaObj.buttonSmall.border};

  &:hover,
  &:active,
  &:focus {
    background: ${figmaObj.buttonSmallHover.background};
    color: ${figmaObj.buttonSmallHover.color};
  }
}

.icon svg {
  fill: ${figmaObj.icon.fill};
  height: ${figmaObj.icon.height};
  width: ${figmaObj.icon.width};
}
`.trim();

// Write new file to current directory

  fs.writeFile('C:/Users/12-5/Downloads/cornerstone-its/assets/scss/custom/figmaSCSS.scss', figmaSCSS, function (err) {
    if (err) throw err;
    console.log(`
███████╗██╗██╗     ███████╗
██╔════╝██║██║     ██╔════╝
█████╗  ██║██║     █████╗  
██╔══╝  ██║██║     ██╔══╝  
██║     ██║███████╗███████╗
╚═╝     ╚═╝╚══════╝╚══════╝
                                           
███████╗ █████╗ ██╗   ██╗███████╗██████╗ 
██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗
███████╗███████║██║   ██║█████╗  ██║  ██║
╚════██║██╔══██║╚██╗ ██╔╝██╔══╝  ██║  ██║
███████║██║  ██║ ╚████╔╝ ███████╗██████╔╝
╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═════╝ 
                                          
`);
    process.exit();
  });

}).catch(err => {
  process.exit();
  throw err;
});

prependFile('C:/Users/12-5/Downloads/cornerstone-its/assets/scss/custom/_kitchen-sink.scss', "@import 'figmaSCSS.scss';\n", function (err) {
  if (err) {
      console.error(err);
  }
  console.log('Imported styles to Kitchen Sink.');
});