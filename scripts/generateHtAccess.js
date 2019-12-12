'use strict';

const util = require('util');
const path = require('path');
const fs = require('fs');

const BUILD_DIR = path.join(__dirname, '../build');
const PATH_NAMES = {
    js: '/static/js',
    css: '/static/css',
    media: '/static/media'
};

function determineAsAttribute(filename) {
    // https://w3c.github.io/preload/#as-attribute
    switch (path.extname(filename)) {
        case '.js':
            return 'script';
        case '.css':
            return 'style';
        case '.svg':
        case '.png':
            return 'image';
        default:
            return '';
    }
}

function getLinkHeaders(pathname, fileNames) {
    return fileNames
        .filter(filename => !/.map$/.test(filename))
        .map(
            filename => `Header add Link "<${pathname}/${filename}>;rel=preload;as=${determineAsAttribute(filename)}"`
        );
}

function getPushResources(pathname, fileNames) {
    return fileNames
        .filter(filename => !/.map$/.test(filename))
        .map(
            filename => `H2PushResource ${pathname}/${filename}`
        );
}

async function generateHtAccessFile() {
    const jsFileNames = await util.promisify(fs.readdir)(path.join(BUILD_DIR, PATH_NAMES.js));
    const cssFileNames = await util.promisify(fs.readdir)(path.join(BUILD_DIR, PATH_NAMES.css));
    const mediaFileNames = await util.promisify(fs.readdir)(path.join(BUILD_DIR, PATH_NAMES.media));
    const headers = [
        ...getLinkHeaders(PATH_NAMES.js, jsFileNames),
        ...getLinkHeaders(PATH_NAMES.css, cssFileNames),
        ...getLinkHeaders(PATH_NAMES.media, mediaFileNames)
    ];
    const resources = [
        ...getPushResources(PATH_NAMES.js, jsFileNames),
        ...getPushResources(PATH_NAMES.css, cssFileNames),
        ...getPushResources(PATH_NAMES.media, mediaFileNames)
    ];

    const htAccessContent = `
<filesMatch ".(jpg|jpeg|png|gif|ico|svg|otf)$">
Header set Cache-Control "max-age=2628000, public"
</filesMatch>
<filesMatch ".(html|css|js)$">
Header set Cache-Control "max-age=86400, public"
</filesMatch>
# compress text, html, javascript, css, xml:
AddOutputFilterByType DEFLATE text/plain
AddOutputFilterByType DEFLATE text/html
AddOutputFilterByType DEFLATE text/xml
AddOutputFilterByType DEFLATE text/css
AddOutputFilterByType DEFLATE application/xml
AddOutputFilterByType DEFLATE application/xhtml+xml
AddOutputFilterByType DEFLATE application/rss+xml
AddOutputFilterByType DEFLATE application/javascript
AddOutputFilterByType DEFLATE application/x-javascript
# Or, compress certain file types by extension:
<files *.html>
SetOutputFilter DEFLATE
</files>
<ifModule http2_module>
    <FilesMatch index.html>
        ${headers.map(header => `  ${header}`).join('\n')}
        ${resources.map(resource => `  ${resource}`).join('\n')}
    </FilesMatch>
</ifModule>
`;

    await util.promisify(fs.writeFile)(path.join(BUILD_DIR, '.htaccess'), htAccessContent);
}

generateHtAccessFile()
    .then(() => {
        console.log('The .htaccess file was successfully generated');
        process.exit(0);
    })
    .catch(error => {
        console.log('The error has occurred during generating .htaccess:');
        console.error(error);
        process.exit(1);
    });
