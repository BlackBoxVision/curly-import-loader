import { parseModule } from 'shift-parser';
import codegen from 'shift-codegen';
import { transform }  from 'babel-core';
import colors from 'colors';

const ShiftConsts = {
    IMPORT: "Import"
};

class ParserManager {

    static _parseData(code) {
        console.log("Processing code :\n".grey.underline + code);

        let toEs6 = transform(code, {presets: "react"}).code;

        return parseModule(toEs6);
    }

    static getImportModules(code) {
        if(!code) throw new Error("There is no code to parse...");

        let parsedData = this._parseData(code);

        console.log("Parser result: \n".grey.underline + JSON.stringify(parsedData));

        return parsedData.items.filter(item => item.type === ShiftConsts.IMPORT);

    }
};

export default ParserManager;