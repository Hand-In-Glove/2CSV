#!/usr/bin/env node
import ora from 'ora';
import { extractHeaders, formatCsvString, handleInput, handleOutput, normalizeObject } from './utils';
import parser from './argsParser';

const arrayToCsv = (data: object[], config = null) => {
    let extractedHeaders: string[];
    let csvString = "";
    if (!config) {
        extractedHeaders = extractHeaders(data);
        csvString += `${extractedHeaders.toString()}\n`
        data.forEach((dataObj) => {
            const normalizedData = normalizeObject(dataObj);
            let row = ''
            extractedHeaders.forEach((header) => {
                row += `${formatCsvString(String(normalizedData[header] || ''))},` || ',';
            })
            csvString += `${row}\n`;
        })
    }
    return csvString;
};

const objectToCsv = (data: object, config = null) => {
    let extractedHeaders: string[];
    let csvString = "";
    if (!config) {
        extractedHeaders = extractHeaders([data]);
        csvString += `${extractedHeaders.toString()}\n`
        const normalizedData = normalizeObject(data)
        let row = ''
        extractedHeaders.forEach((header) => {
            row += `${formatCsvString(String(normalizedData[header]))},` || ',';
        })
        csvString += `${row}\n`;
    }
    return csvString;
}

const main = async (args) => {
    const spinner = ora('Reading Input 📖').start();
    const dataToParse = await handleInput(args.i, args.s);
    
    let csvString: string;
    spinner.text = "Converting Data 🧪"
    if (Array.isArray(dataToParse)) {
        csvString = arrayToCsv(dataToParse);
    } else {
        csvString = objectToCsv(dataToParse);
    }
    spinner.text = "Writing results to file 🖊"
    await handleOutput(args.o, csvString);
    spinner.stopAndPersist({
        text: 'Conversion successful',
        symbol: '🦄'
    })
}

export default (dataToParse: unknown, config = {}) => {
    if (Array.isArray(dataToParse)) {
        return arrayToCsv(dataToParse, config);
    } else {
        return objectToCsv(dataToParse as object, config);
    }
}


if (require.main === module) {
    (async () => {
        try{
            const args = await parser.argv
            await main(args);
            process.exit(0);
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    })()
}