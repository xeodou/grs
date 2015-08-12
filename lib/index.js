var JSONStream, request, _;

request = require('request');

_ = require('highland');

JSONStream = require('JSONStream');

request = request.defaults({
  headers: {
    accept: 'application/vnd.github.manifold-preview',
    'user-agent': 'grs-releases/' + require('../package.json').version
  }
});

module.exports = function(options) {

  /**
   * options.repo
   * options.tag
   * options.name
   */
  var option, stream, token, _i, _len, _ref;
  _ref = ['repo', 'tag', 'name'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    option = _ref[_i];
    if (!options || !options[option]) {
      throw new Error("Miss option " + option);
    }
  }
  token = options.token ? "?access_token=" + options.token : "";
  return stream = _(request("https://api.github.com/repos/" + options.repo + "/releases" + token).pipe(JSONStream.parse('*'))).map(function(res) {
    if (typeof res === 'string') {
      return stream.emit('error', new Error(("" + options.repo + " " + options.tag + " " + options.name + " ") + res));
    } else {
      return res;
    }
  }).where({
    tag_name: options.tag
  }).map(function(release) {
    return release.assets;
  }).flatten().find(function(asset) {
    return asset.name === options.name;
  }).flatMap(function(asset) {
    var uri;
    uri = "https://github.com/" + options.repo + "/releases/download/" + options.tag + "/" + asset.name;
    stream.emit('size', asset.size);
    return _(request(uri));
  });
};
