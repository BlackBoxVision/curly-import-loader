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
})

class ParserManager {

    static parseData(code) {
        if(!code) throw new Error("There is no code to parse...");

        console.log("Processing code :\n".grey.underline + code);

        let toEs6 = transform(code, {presets: "react"}).code;
        let parsedData = parseModule(toEs6);

        console.log("Parser result: \n".grey.underline + JSON.stringify(parsedData));

        return parsedData;
    }

    static getImportModules(parsedData) {
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

    static modifyImports(code, importDataMap) {
        if(!code) throw new Error("There is no code to modify...");
        if(!importDataMap) throw new Error("There is no specified which imports should be changed...");

        let parsedData = this.parseData(code);
        let imports = this.getImportModules(parsedData);
        let namedImports = imports.map(data => {
            let nameImport = [...data.namedImports];
            data.namedImports = []; // Clean namedImports, those will be replaced by absolute!
            return nameImport;
        });

        let defaultBindings = this._createDefaultBindingsFromNamedImports(namedImports, importDataMap);

        console.log("Changed Import: \n".gray + JSON.stringify(defaultBindings));

        console.log(JSON.stringify(defaultBindings));

        defaultBindings.forEach(defBind => {
            parsedData.items.unshift(defBind);

        })

        console.log("New Parsed Data: \n".red + JSON.stringify(parsedData));

        return parsedData;
    }

    static generateCode(parsedData) {
        if(!parsedData) throw new Error("Parsed data should not be empty");

        return codegen(parsedData);
    }
};

export default ParserManager;