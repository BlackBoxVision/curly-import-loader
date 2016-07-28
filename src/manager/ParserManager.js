import { parseModule } from 'shift-parser';
import codegen from 'shift-codegen';
import { transform }  from 'babel-core';
import colors from 'colors';

const ShiftConsts = {
    IMPORT: "Import"
};

const createDefaultBind = (bindName, newModuleName) => ({
    type:"Import",
    defaultBinding:{
        type:"BindingIdentifier",
        name: bindName
    },
    namedImports: [],
    moduleSpecifier: newModuleName
});


class ParserManager {

    static parseData(code) {
        if(!code) throw new Error("There is no code to parse...");

        console.log("Processing code :\n".grey.underline + code);

        let toEs6 = transform(code, {presets: "react"}).code;
        let parsedData = parseModule(toEs6);

        console.log("Parser result: \n".grey.underline + JSON.stringify(parsedData));

        return parsedData;
    }

    static _getImportModules(parsedData) {
        if(!parsedData) throw new Error("There is no parse data...");

        let importModules = parsedData.items.filter(item => item.type === ShiftConsts.IMPORT);

        console.log("Imports: \n".grey.underline + JSON.stringify(importModules));


        return importModules;

    }

    static _createDefaultBindingsFromNamedImports(namedImports, absolutePathImportMap) {
        let defaultBindings = [];

        namedImports.forEach(named => {
            named.forEach(specifiers => {
                let bindName = specifiers.binding.name;
                let newModuleName = absolutePathImportMap[bindName];
                if(absolutePathImportMap[bindName]) {
                    defaultBindings.push(createDefaultBind(bindName, newModuleName));
                }
            })
        });

        return defaultBindings;
    }

    static _getNamedImports(imports) {
        return imports.map(data => {
            return data.namedImports;
            //data.namedImports = []; // Clean namedImports, those will be replaced by absolute!
            //return nameImport;
        });
    }

    static _sanitizeImportsAndSaveBindings(parsedData, defaultBindings) {
        let newParsedData = {...parsedData};

        newParsedData.items.forEach((i, index) => {
            if(i.type === ShiftConsts.IMPORT) {
                if(!i.defaultBinding)
                    newParsedData.items.splice(index, 1);
                else
                    i.namedImports = [];
            }
        })

        defaultBindings.forEach(defBind => {
            newParsedData.items.unshift(defBind);

        })

        return newParsedData;
    }

    static modifyImports(code, importDataMap) {
        if(!code) throw new Error("There is no code to modify...");
        if(!importDataMap) throw new Error("There is no specified which imports should be changed...");

        let parsedData = this.parseData(code);
        let imports = this._getImportModules(parsedData);
        let namedImports = this._getNamedImports(imports);

        // Generate the defaultBinding imports which will replace the namedImports (Curly Imports) in the parsedData
        let defaultBindings = this._createDefaultBindingsFromNamedImports(namedImports, importDataMap);

        console.log("Changed Import: \n".gray + JSON.stringify(defaultBindings));

        let newParserData = this._sanitizeImportsAndSaveBindings(parsedData, defaultBindings)

        console.log("New Parsed Data: \n".red + JSON.stringify(newParserData));

        return newParserData;
    }

    static generateCode(parsedData) {
        if(!parsedData) throw new Error("Parsed data should not be empty");

        return codegen(parsedData);
    }
};

export default ParserManager;