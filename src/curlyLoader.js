import { parseModule } from 'shift-parser';
import { transform }  from 'babel-core';
import colors from 'colors'

const optimizeCurlyImports = (file, callback) => {

    let toEs6 = transform(file, {presets: "react"}).code;
    let parsedData = parseModule(toEs6);
    let importedModules = parsedData.items.find(item => item.type === "Import");

    console.log("Processing code :\n".grey.underline + toEs6);
    console.log("Parser result: \n".grey.underline + JSON.stringify(parsedData));
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