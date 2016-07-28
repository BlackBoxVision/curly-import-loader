import ParserManager from './manager/ParserManager';

if(process.env.NODE_ENV === "production") console.log = () => {};

const optimizeCurlyImports = (file, callback) => {

    let importMap = {
        PropTypes: "react/lib/ReactPropTypes",
        Component: "react/lib/ReactComponent"
    }

    let parsedData = ParserManager.modifyImports(file, importMap);
    let newFile = ParserManager.generateCode(parsedData);

    console.log("File \n" + newFile );
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