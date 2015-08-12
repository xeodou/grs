# GRS

> A github releases stream module

## Getting Started

Install via [npm](http://npmjs.org/grs)

```shell
   npm i grs --save
```

## Usage

```Javascript
var grs = require('grs');

grs({
    repo: 'kbhomes/radiant-player-mac',
    tag: 'v1.1.3',
    name: 'Radiant.Player.zip',
    token: 'abxujuxjsjaalal'    // optional
}).pipe(dist);
```

grs is a readable and writeable stream object.

`token` option is needed to avoid API access limit exceeded error of github.
github allows only 60 times anonymous API access per hour from single global IP address.
You can get your own token at [Personal access tokens](https://github.com/settings/tokens) page.
Never spread your token.

### Event
* `error` If some thing will emit an error event.
* `size` If get the right package info will emit a size event describe the size of the package.


## License

MIT
