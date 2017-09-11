const monadic = require("monadic-js");
const {mapM, guard} = monadic.Utility;
const Async = monadic.Async;
const path = require("path");
const fs = require("fs");
const spawn = require("child_process").spawn;

//wrap node functions as Async
const readFile = Async.wrap(fs.readFile);
const writeFile = Async.wrap(fs.writeFile);
const readdir = Async.wrap(fs.readdir);
const stat = Async.wrap(fs.stat);

//mkdir -p command
const mkdirp = p => Async.create((succ, fail) => {
	const mkdir = spawn('mkdir', ['-p', p]);

	mkdir.on('close', code => {
		if (code) fail('Failed with code: ' + code);
		else succ();
	});
});

//get filename from path with no extension
const fname = file => path.basename(file, path.extname(file));


/**
 *	ejsmc
 *	written by Joel Dentici
 *	on 9/10/2017
 *
 *	Compile monadic-js expression extensions.
 */

const exts = new Set([
	'.ejs',
]);

/**
 *	getName :: string -> string
 *
 *	Get the compiled name of an input file/module.
 *
 *	If the name is a path, the "directory name" of the
 *	path is preserved in the output.
 */
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

/**
 *	clean :: string -> string
 *
 *	Remove the quotes from a module name
 */
function clean(module) {
	return module.substring(1, module.length - 1);
}

/**
 *	req :: string -> string
 *
 *	Creates a new require statement from a module
 *	name.
 */
function req(name) {
	return 'require(' + JSON.stringify(name) + ')';
}

/**
 *	updateRequire :: (string, string) -> [string, string]
 *
 *	Updates the require statements in the file and returns
 *	the updated source code and file name.
 */
function updateRequire(source, fileName, inputDirList) {
	const outName = getName(path.basename(fileName), inputDirList);

	const outCode = source.replace(
		/(^\s*|=\s*)require\((.*)\)/g,
		(_, m, m2) => m + req(getName(clean(m2), inputDirList))
	);

	return [outCode, outName];
}

/**
 *	compileFile :: (string, [string], string) -> Async ()
 *
 *	Reads the contents of the specified file, compiles it,
 *	updates require statements in it, and then stores it
 *	in the output directory.
 */
function compileFile(file, inputDirList, outputDir) {
	return ( () => { return ( readFile )(file).chain((contents) => { return ( mkdirp )(outputDir).chain((_) => { return ( (( exts.has )(( path.extname )(file)) || ( path.extname )(file) === '.js') ? (( () => { return ( (( exts.has )(( path.extname )(file))) ? (( Async.fromEither )(( monadic.transformDo )(contents))) : (Async.of(( contents.toString )())) ).chain((compiled) => { const [ output, newFilename ] = ( updateRequire )(compiled, file, inputDirList);
return ( writeFile )(( path.join )(outputDir, newFilename), output) }) } )()) : (Async.of(undefined)) ) }) }) } )();
}

/**
 *	compileDirectory :: (string, string) -> Async ()
 *
 *	Reads the directory entries for a directory and compiles
 *	each file inside of it, storing the result in the output
 *	directory.
 */
function compileDirectory(dir, outputDir) {
	function action(inputDirList) {
		return f => ( () => { const file = ( path.join )(dir, f);
return ( stat )(file).chain((stats) => { return ( (( stats.isFile )()) ? (( compileFile )(file, inputDirList, outputDir)) : (( compileDirectory )(file, outputDir)) ) }) } )();
	}

	return ( () => { return ( readdir )(dir).chain((inputDirList) => { return ( ( mapM )(Async, ( action )(inputDirList)) )(inputDirList) }) } )();
}

/**
 *	compile :: (string, string) -> Async ()
 *
 *	Compiles either a file or directory and stores the
 *	results in the output directory.
 */
function compile(input, outputDir) {
	if (exts.has(path.extname(input))) {
		return ( () => { return ( readdir )(( path.dirname )(input)).chain((inputDirList) => { return ( compileFile )(file, inputDirList, outputDir).chain((_) => { return Async.of(`Compiled ${input}, stored result in ${outputDir}`) }) }) } )();
	}
	else {
		return ( () => { return ( compileDirectory )(input, outputDir).chain((_) => { return Async.of(`Compiled all modules in ${input}, stored results in ${outputDir}`) }) } )();
	}
}

module.exports = {
	compile
};