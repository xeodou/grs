var grs = require('../');
var fs = require('fs');

grs({
    repo: 'kbhomes/radiant-player-mac',
    tag: 'v1.1.3',
    name: 'Radiant.Player.zip'
}).pipe(fs.createWriteStream('./Radiant.Player.zip'));
