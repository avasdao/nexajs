module.exports = function (jsModule) {
    switch (jsModule) {
        case 'drivelist': return require('drivelist/build/Release/drivelist.node');
    }
    throw new Error(`unhandled module: "${jsModule}"`);
}