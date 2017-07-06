# superagent-charset

> add charset support for node's superagent

[![Build Status](https://img.shields.io/travis/magicdawn/superagent-charset.svg?style=flat-square)](https://travis-ci.org/magicdawn/superagent-charset)
[![Coverage Status](https://img.shields.io/codecov/c/github/magicdawn/superagent-charset.svg?style=flat-square)](https://codecov.io/gh/magicdawn/superagent-charset)
[![npm version](https://img.shields.io/npm/v/superagent-charset.svg?style=flat-square)](https://www.npmjs.com/package/superagent-charset)
[![npm downloads](https://img.shields.io/npm/dm/superagent-charset.svg?style=flat-square)](https://www.npmjs.com/package/superagent-charset)
[![npm license](https://img.shields.io/npm/l/superagent-charset.svg?style=flat-square)](http://magicdawn.mit-license.org)
[![Greenkeeper badge](https://badges.greenkeeper.io/magicdawn/superagent-charset.svg)](https://greenkeeper.io/)


## Install
```js
$ npm i superagent-charset --save
```

## API

### install

```js
const request = require('superagent')
require('superagent-charset')(request)
```

this will add `request.Request.prototype.charset`

### charset

`.charset(encoding)` , will passed to [iconv-lite](https://github.com/ashtuchkin/iconv-lite)

```js
const should = require('should')
const request = require('superagent')
require('superagent-charset')(request) // install charset

describe('Basic Test', function() {
  it('it works', function(done) {
    request.get('http://www.sohu.com/')
      .charset('gbk')
      .end((err, res) => {
        res.text.should.match(/搜狐/)
        done(err)
      })
  })
})
```

## License
the MIT License, http://magicdawn.mit-license.org