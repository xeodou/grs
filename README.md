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
    name: 'Radiant.Player.zip'
}).pipe(dist);
```

grs is a readable and writeable stream object.

### Event
* `error` If some thing will emit an error event.
* `size` If get the right package info will emit a size event describe the size of the package.


## License

MIT
