import { parseModule } from 'shift-parser';
import codegen from 'shift-codegen';
import { transform }  from 'babel-core';
import colors from 'colors';

const ShiftConsts = {
    IMPORT: "Import"
};


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


    static modifyImports(code, importDataMap) {
        if(!code) throw new Error("There is no code to modify...");
        if(!importDataMap) throw new Error("There is no specified which imports should change...");

        let parsedData = this.parseData(code);
        let imports = this.getImportModules(parsedData);


    }
};

export default ParserManager;