import { writeFile } from "fs/promises";
import { join } from "path";

const notAllowed = (escapeChar: string): boolean => {
    return [","].includes(escapeChar);
}

const CHARS_TO_WRAP = /[,.]/g;

/**
 * 
 * @param unformatted string to format for valid CSV entry
 * @param escapeChar optional escape character to be used, defaults to "
 */
export const formatCsvString = (unformatted: string, escapeChar = `"`) => {
    if (notAllowed(escapeChar)) throw new Error("An illegal escape character was provided.");
    const formatted = unformatted.replaceAll('"', '""');
    if (CHARS_TO_WRAP.test(unformatted)) return `"${formatted}"`;
    return formatted;
}

export const normalizeObject = (data: object, prefix = '', newData = {}) => {
    Object.entries(data).forEach(([key, value]) => {
        const qualifiedKey = prefix ? `${prefix}_${key}` : key;
        if (typeof value === "object") {
            newData = { 
                ...newData,
                ...normalizeObject(value, qualifiedKey, newData),
            };
        } else if (Array.isArray(value)) {
            newData = {
                ...newData,
                ...normalizeArray(value, key, qualifiedKey, newData)
            }
        } else {
            newData[qualifiedKey] = value;
        }
    });
    return newData;
};

export const normalizeArray = (data: unknown[], key: string, prefix = '', newData = {}) => {
    data.forEach((item, i) => {
        const qualifiedKey = prefix ? `${prefix}_${i}` : `${key}_${i}`;
        if (Array.isArray(item)) {
            newData = {
                ...newData,
                ...normalizeArray(item, key, qualifiedKey, newData)
            }
        } else if (typeof item === "object") {
            newData = { 
                ...newData,
                ...normalizeObject(item, qualifiedKey, newData),
            };
        } else {
            newData[qualifiedKey] = item;
        }
    })
    return newData;
}

export const extractHeaders = (data: object[] | object) => {
    if (Array.isArray(data)) {
        const all = data.reduce((keys: string[], obj)=> {
            const normalizedData = normalizeObject(obj);
            return keys.concat(Object.keys(normalizedData));
        }, []) as string[]
        return Array.from(new Set(all));
    }
    return Object.keys(normalizeObject(data))
};

export const getInputFromStdIn = async (specificField: string) => {
    return new Promise((resolve, reject) => {
        process.stdin.resume();
        process.stdin.setEncoding('utf-8');
        let input = '';
        process.stdin.on('data', chunk => (input += chunk));
        process.stdin.on('error', (err) => reject(new Error(`Error processing stdin: \n${err}`)));
        process.stdin.on('end', () => {
          try {
            resolve(specificField ? JSON.parse(input)[specificField] : JSON.parse(input));
          } catch (err) {
            reject(new Error('Invalid data received from stdin'));
          }
        });
    })
}

export const handleInput = async (input: string, specificField: string) => {
    if (input) {
        const data = require(join(process.cwd(),input))
        return specificField ? data[specificField] : data;
    }
    return getInputFromStdIn(specificField);
};

export const handleOutput = async (output: string, csvString: string) => {
    await writeFile(output, csvString).catch(err => new Error(`Could not write to file: \n${err}`))
}