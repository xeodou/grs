request = require 'request'
_ = require 'highland'
JSONStream = require 'JSONStream'

module.exports = (options)->

    ###*
     * options.repo
     * options.tag
     * options.name
    ###

    headers =
        'Accept': 'application/vnd.github.v3'
        'User-Agent': 'grs-releases/' + require('../package.json').version

    if options.token
        headers['Authorization'] = 'token ' + options.token

    request = request.defaults
        headers: headers

    baseRequest = request.defaults(options.requestOptions)

    for option in ['repo', 'tag', 'name']
        if !options || !options[option]
            throw new Error("Miss option #{option}")
    stream = _(baseRequest("https://api.github.com/repos/#{options.repo}/releases")
    .pipe(JSONStream.parse('*')))
    .map (res)->
        if typeof res is 'string'
            stream.emit 'error', new Error("#{options.repo} #{options.tag} #{options.name} " + res)
        else res
    .where ({tag_name: options.tag})
    .map (release)->
        return release.assets
    .flatten()
    .find (asset)->
        return asset.name  is options.name
    .flatMap (asset)->
        stream.emit 'size', asset.size
        return _(baseRequest(asset.url,
            headers:
                'Accept': 'application/octet-stream'))
