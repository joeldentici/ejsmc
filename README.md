# ejsmc
Compile modules using `monadic-js` expression extensions. This is useful to use them in code that will run in the browser or when developing a library to release to NPM.

For a nodejs application, this is unnecessary as you can simply use the module loader extension in `monadic-js`.

## Installation
`npm install -g ejsmc`

## Usage
```
$ cd /path/to/project
$ ejsmc path/to/module.ejs path/to/output
OR
$ ejsmc path/to/module/src path/to/output
```

The first option will compile only a single module. The second will compile all modules in the directory, recursively (copying normal .js files untouched except for updating require statements as necessary). Any require statements that exist using a .ejs extension will be replaced with a normal .js extension. If both a .js and .ejs exist in the same directory, with the same name, the .ejs will have "-ejs" appended before the extension.

## Planned Features
A later version will support ES6 modules. Right now, CommonJS module loading only is supported.