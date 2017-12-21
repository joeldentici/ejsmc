#! /usr/bin/env node
(function() {
const path = require('path');

const oldRequire = require;
function fname(file) {
	return path.basename(file, path.extname(file));
}
function getName(fileName) {
	const ext = path.extname(fileName).replace(/\./, '');

	if (ext && ext !== 'js') {
		return path.dirname(fileName) 
		 + '/' + fname(fileName) + `-${ext}.js`;
	}
	else {
		return fileName;
	}
}

require = function(pathStr) {
	return oldRequire(getName(pathStr));
}

})();


const monadic = require('monadic-js');
monadic.loadDo('.ejs');

const {compile} = require('./index.ejs');

const [_, __, input, output] = process.argv;

console.log("Compiling...");

compile(input, output).fork(
	s => console.log(s),
	e => console.error(e)
);