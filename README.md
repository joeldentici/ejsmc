# ejs Module Compiler (ejsmc)
Compile modules using `monadic-js` expression extensions. This is useful to use them in code that will run in the browser or when developing a library to release to NPM. You can run this as a prior step to using `webpack` on your source code for projects targeting the browser or both platforms. This generates ES6 code.

For a Node.js application this is unnecessary as you can simply use the module loader extension in `monadic-js`.

Documentation for the expression extensions can be found [here](https://github.com/joeldentici/monadic-js#do-notation--expression-extensions).

The target language is the one included in version `1.2.3` of `monadic-js`. This package will be kept updated to track the version used by `monadic-js` and its version numbers will be kept identical up to minor version (due to semantic versioning, if the language in `monadic-js` becomes backwards incompatibile, it is necessary for the version of this package to reflect that as well -- the easiest way to do this is to have the same version numbers).

## Installation
`npm install -g ejsmc`

## Usage
`ejsmc [src] [lib/bin]`
### Examples
```
$ cd /path/to/project
$ ejsmc path/to/module.ejs path/to/output
OR
$ ejsmc path/to/module/src path/to/output
```

The first option will compile only a single module. The second will compile all modules in the directory, recursively (copying normal `.js` files untouched except for updating require statements as necessary). Any `*.ejs` files will be compiled and renamed to `*-ejs.js`. Require statements (CommonJS style) will be updated in all source files so that when a `.ejs` file is required, the correct name for the compiled `-ejs.js` file is used.

The compilation is done on a module-per-module basis. Beyond renaming the modules that are required, nothing resembling linking or following import paths is done. The directory structure of your source directory is preserved in the output directory when using the recursive compilation option, so your require statements should work equivalently to before.

## Planned Features
A later version will support ES6 modules. Right now, CommonJS module loading only is supported.
