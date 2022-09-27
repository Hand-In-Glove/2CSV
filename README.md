# 2CSV                       

## About
A node js project for converting documents or data to csv format files.

Current version (**1.0.0**) supports json to csv conversion. 

More formats to be supported in future versions

## Usage
### In source code.

Install.

```bash
npm i 2CSV
```
Import

```javascript
import { json2Csv } from '@sdent/2csv';
```
Convert
```javascript
import { json2Csv } from '@sdent/2csv';
import someData from './someData.json'

const csvString = json2Csv(someData)
```
### From CLI.
Global Install (so you can call it from anywhere 🌈)

```bash
npm i -g @sdent/2csv
```
Use it!
```bash
json2Csv -i ./someData.json
```
Options

Calling with not options means data will be read from standard in (so you can pipe data from elsewhere if desired) and output in the current directory as _out.csv_

```bash
cat ./someData.json | json2Csv
```
or even 
```bash
curl -H "Accept: application/json" https://icanhazdadjoke.com/ | json2Csv
```

If you do want to pass options the current API looks like:

|Option |   Alias   |                Description             | Default         |
|-------|-----------|----------------------------------------|-----------------|
| -i    | --input   | file path to data for conversion       | read from stdin |
| -o    | --output  | file path for output csv file          | out.csv         |
| -s    | --specific-field | Only convert the data from within a specific field of the json | |