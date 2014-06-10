var grs = require('../');
var fs = require('fs');
var through2 = require('through2');

var s = grs({
    repo: 'kbhomes/radiant-player-mac',
    tag: 'v1.1.3',
    name: 'Radiant.Player.zip'
}).on('error', function(error) {
    console.log(error);
}).on('size', function(data) {
    console.log(data);
}).pipe(through2(function(chunk, encoding, cb) {
    console.log(chunk.length);
    this.push(chunk);
    cb();
})).pipe(fs.createWriteStream('./Radiant.Player.zip'));
