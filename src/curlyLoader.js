import ParserManager from './ParserManager';

const optimizeCurlyImports = (file, callback) => {

    let importedModules = ParserManager.getImportModules(file);

    console.log("Imports to be processed : \n".grey.underline + JSON.stringify(importedModules));

    return callback(null, file);
}

function curlyLoader(file) {
    console.log("---Starting Curly Loader---");

    var callback = this.async();
    if(!callback) return file;

    optimizeCurlyImports(file, (err, result) => {
        if(err) return callback(err);
        callback(null, result);
    })
}


export default curlyLoader;