#! /usr/bin/env node

const monadic = require("monadic-js");
monadic.loadDo('.ejs');

const {compile} = require("./index-ejs.js");

const [_, __, input, output] = process.argv;

console.log("Compiling...");

compile(input, output).fork(
	s => console.log(s),
	e => console.error(e)
);