const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const cssvariables = require('postcss-css-variables');

const cssFilesDirPath = path.join(__dirname, '../build/static/css');
const cssFiles = fs.readdirSync(cssFilesDirPath).filter(file => file.endsWith('.css'));

cssFiles.map(filename => {
    const filePath = path.join(cssFilesDirPath, filename);
    const cssContent = fs.readFileSync(filePath, 'utf-8');
    const processedCssContent = postcss([cssvariables()]).process(cssContent).css;

    fs.writeFileSync(filePath, processedCssContent);
});
