var JSONStream, request, through2, _;

request = require('request');

_ = require('highland');

through2 = require('through2');

JSONStream = require('JSONStream');

module.exports = function(options) {

  /**
   * options.repo
   * options.tag
   * options.name
   */
  var option, steam, _i, _len, _ref;
  _ref = ['repo', 'tag', 'name'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    option = _ref[_i];
    if (!options || !options[option]) {
      throw new Error("Miss option " + option);
    }
  }
  request = request.defaults({
    headers: {
      accept: 'application/vnd.github.manifold-preview',
      'user-agent': 'grs-releases/' + require('../package.json').version
    }
  });
  steam = request("https://api.github.com/repos/" + options.repo + "/releases").pipe(JSONStream.parse('*'));
  return _(steam).map(function(res) {
    if (typeof res === 'string') {
      throw new Error(("" + options.repo + " " + options.tag + " " + options.name + " ") + res);
    } else {
      return res;
    }
  }).find(function(release) {
    return release.tag_name === options.tag;
  }).flatten().map(function(release) {
    return release.assets;
  }).flatten().find(function(asset) {
    return asset.name === options.name;
  }).map(function(asset) {
    return "https://github.com/" + options.repo + "/releases/download/" + options.tag + "/" + asset.name;
  }).flatMap(function(uri) {
    return _(request(uri));
  });
};
