var JSONStream, request, _;

request = require('request');

_ = require('highland');

JSONStream = require('JSONStream');

module.exports = function(options) {

  /**
   * options.repo
   * options.tag
   * options.name
   */
  var baseRequest, headers, option, stream, _i, _len, _ref;
  headers = {
    'Accept': 'application/vnd.github.v3',
    'User-Agent': 'grs-releases/' + require('../package.json').version
  };
  if (options.token) {
    headers['Authorization'] = 'token ' + options.token;
  }
  request = request.defaults({
    headers: headers
  });
  baseRequest = request.defaults(options.requestOptions);
  _ref = ['repo', 'tag', 'name'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    option = _ref[_i];
    if (!options || !options[option]) {
      throw new Error("Miss option " + option);
    }
  }
  return stream = _(baseRequest("https://api.github.com/repos/" + options.repo + "/releases").pipe(JSONStream.parse('*'))).map(function(res) {
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
    stream.emit('size', asset.size);
    return _(baseRequest(asset.url, {
      headers: {
        'Accept': 'application/octet-stream'
      }
    }));
  });
};
