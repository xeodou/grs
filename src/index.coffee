request = require 'request'
_ = require 'highland'
JSONStream = require 'JSONStream'

module.exports = (options)->

    ###*
     * options.repo
     * options.tag
     * options.name
    ###

    for option in ['repo', 'tag', 'name']
        if !options || !options[option]
            throw new Error("Miss option #{option}")

    request = request.defaults
        headers:
            accept: 'application/vnd.github.manifold-preview'
            'user-agent': 'grs-releases/' + require('../package.json').version

    stream = _(request("https://api.github.com/repos/#{options.repo}/releases")
    .pipe(JSONStream.parse('*')))
    .map (res)->
        if typeof res is 'string'
            stream.emit 'error', new Error("#{options.repo} #{options.tag} #{options.name} " + res)
        else res
    .find (release)->
        return release.tag_name is options.tag
    .flatten().map (release)->
        return release.assets
    .flatten().find (asset)->
        return asset.name  is options.name
    .flatMap (asset)->
        uri = "https://github.com/#{options.repo}/releases/download/#{options.tag}/#{asset.name}"
        stream.emit 'size', asset.size
        return _(request(uri))
