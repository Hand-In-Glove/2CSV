import yargs from "yargs/yargs";

const parser = yargs(process.argv.slice(2)).options({
    i: { type: 'string', default: false, alias: 'input', description: 'filepath for input otherwise defaults to stdin'},
    o: { type: 'string', default: './out.csv', alias: 'output', description: 'filepath for output otherwise defaults to out.csv'},
    s:  { type: 'string', default: false, alias: 'specific-field', description: 'a specific field to parse, all other fields will be ignored'}
});

export default parser;