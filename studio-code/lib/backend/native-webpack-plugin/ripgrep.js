
const path = require('path');

exports.rgPath = path.join(__dirname, `./native/rg${process.platform === 'win32' ? '.exe' : ''}`);
