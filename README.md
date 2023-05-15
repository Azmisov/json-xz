# json-xz

Small library to read and write [XZ](https://en.wikipedia.org/wiki/XZ_Utils) compressed JSON files.
XZ compression gives you some of the highest compression ratios, while still being very fast. This
utilizes the [xz](https://www.npmjs.com/package/xz) library, which is a multithreaded C++ binding to
liblzma.

[npm package](https://www.npmjs.com/package/json-xz) |
[GitHub source code](https://www.github.com/Azmisov/json-xz)

## Installation

```
npm i json-xz
```

A minified version is provided as `jsonxz.min.js`. A bundle is not provided, as `xz` uses `node-gyp`
to compile C++ bindings. See documentation for `node-gyp` if the `xz` dependency is not installing.

## Usage

```js
import jsonxz from "json-xz";

const data = await jsonxz.read("./data.json.xz");
// compression level is 1 (least/fastest) to 9 (most/slowest); default is 6
await jsonxz.write("./data.json.xz", data, 6);
```

For convenience, you can also read/write raw data from XZ compressed files. You can use this
interface if you want to stringify the JSON yourself, or perhaps use some other format besides JSON:

```js
const raw_data_str = await jsonxz.readFile("./data.xz");
// you can also write a Buffer or Uint8Array
await jsonxz.writeFile("./data.xz", raw_data_str, 6);
```

This gives ~27% size reduction for some example data, and compression generally seems to be around
that for different JSON files.