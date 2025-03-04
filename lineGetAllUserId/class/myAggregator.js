/**
 * myAggregator.js
 *
 * class：Aggregate
 * function：aggregate to csv file
 **/

"use strict";

// modules
import XLSX from 'xlsx'; // xlsx
     
export class Aggregate {

    static wb;

    // constractor
    constructor() {
    }

    // initialize
    init(bookPath) {
        return new Promise(resolve => { 
            try {
                // book path
                this.path = bookPath;
                // set worksheet
                Aggregate.wb = XLSX.readFile(this.path);
                // resolved
                resolve();
            } catch(e) {
                // error
                console.log(e);
            }
        });
    }

    // write data
    writeData(titleArray, twoDimArray, sheetName) {
        return new Promise(resolve => {  
            try { 
                // set worksheet
                const outWs = XLSX.utils.aoa_to_sheet(titleArray);
                // add title
                XLSX.utils.book_append_sheet(Aggregate.wb, outWs, sheetName);
                // add data
                XLSX.utils.sheet_add_aoa(outWs, twoDimArray,{ origin: { r: 1, c: 0 } });
                // resolved
                resolve();
            } catch(e) {
                // error
                console.log(e);
            }
        });
    }

    // make csv file
    makeCsv() {
        return new Promise(async(resolve) => {  
            try { 
                // write file
                XLSX.writeFile(Aggregate.wb, this.path);
                // resolved
                resolve();
            } catch(e) {
                // error
                console.log(e);
            }
        });
    }
}