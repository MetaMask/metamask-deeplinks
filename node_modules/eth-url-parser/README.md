# eth-url-parser

[![npm](https://img.shields.io/npm/v/eth-url-parser.svg)](https://npmjs.com/package/eth-url-parser) [![npm](https://img.shields.io/npm/dm/eth-url-parser.svg)](https://npmjs.com/package/eth-url-parser) 
![CircleCI branch](https://img.shields.io/circleci/project/github/brunobar79/eth-url-parser/master.svg)


Module that supports parsing / parsing of all the different ethereum standard urls: [ERC-681](https://eips.ethereum.org/EIPS/eip-681) and [ERC-831](https://eips.ethereum.org/EIPS/eip-831)

This module contains two functions:

## `parse(string)`

Takes in a string of an Ethereum URL and returns an object matching that URL according to the previously mentioned standards
The returned object looks like this:

```javascript
{
    scheme: 'ethereum',
    target_address: '0x1234DEADBEEF5678ABCD1234DEADBEEF5678ABCD', // ENS names are also supported!
    chain_id: '1',
    parameters: {
        'value': '2014000000000000000', // (in WEI)
        'gas': '10',
        'gasLimit': '45000',
        'gasPrice': '50',
    }
}
```

## `build(object)`

Takes in an object representing the different parts of the ethereum url and returns a string representing a valid ethereum url

## Getting started

`$ npm install eth-url-parser --save`

## Usage

```javascript
import { parse, build } from 'eth-url-parser';

const parsedUrl = parse('ethereum:0x1234DEADBEEF5678ABCD1234DEADBEEF5678ABCD')
console.log(parseUrl.target_address)
// '0x1234DEADBEEF5678ABCD1234DEADBEEF5678ABCD'

const url =  build({
        scheme: 'ethereum',
        prefix: 'pay',
        target_address: '0x1234DEADBEEF5678ABCD1234DEADBEEF5678ABCD'
    });
console.log(url);
// 'ethereum:pay-0x1234DEADBEEF5678ABCD1234DEADBEEF5678ABCD'

```

## License

MIT

## Credits

This repo is a combination of [erc681](https://github.com/parity-js/erc681) (by [@parity-js](https://github.com/parity-js)) and [eip681](https://github.com/tokenkit/eip681/) (by [tokenkit](https://github.com/tokenkit))
