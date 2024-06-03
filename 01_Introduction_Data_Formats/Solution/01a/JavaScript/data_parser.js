const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const yaml = require('js-yaml');
const csv = require('csv-parser');

function parseTextFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf8').trim().split(/\r?\n\r?\n/);
    const parsedData = data.map(person => {
        const details = person.split(/\r?\n/);
        const personData = {};
        details.forEach(detail => {
            const [key, value] = detail.split(': ');
            personData[key.toLowerCase()] = value;
        });
        return personData;
    });
    console.log("Txt data:");
    console.log(parsedData);
    console.log("");
}

function parseXmlFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    xml2js.parseString(data, (err, result) => {
        if (err) {
            throw err;
        }
        const parsedData = result.people.person.map(person => {
            const personData = {};
            for (const [key, value] of Object.entries(person)) {
                personData[key] = value[0];
            }
            return personData;
        });
        console.log("XML data:");
        console.log(parsedData);
        console.log("");
    });
}

function parseYamlFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    const parsedData = yaml.load(data);
    console.log("YAML data:");
    console.log(parsedData);
    console.log("");
}

function parseJsonFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    const parsedData = JSON.parse(data);
    console.log("JSON data:");
    console.log(parsedData);
    console.log("");
}

function parseCsvFile(filePath) {
    const parsedData = [];
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => parsedData.push(data))
        .on('end', () => {
            console.log("CSV data:");
            console.log(parsedData);
            console.log("");
        });
}

const supportedFiles = {
    '.txt': parseTextFile,
    '.xml': parseXmlFile,
    '.yaml': parseYamlFile,
    '.yml': parseYamlFile,
    '.json': parseJsonFile,
    '.csv': parseCsvFile
};

function parseFile(filePath) {
    const fileType = path.extname(filePath);
    if (fileType in supportedFiles) {
        supportedFiles[fileType](filePath);
    } else {
        return null;
    }
}

function parseAllFilesInFolder(folderPath) {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            throw err;
        }
        files.forEach((filename) => {
            const filePath = path.join(folderPath, filename);
            if (fs.statSync(filePath).isFile()) {
                parseFile(filePath);
            }
        });
    });
}

const dataFolderPath = path.resolve(__dirname, '../Data');
parseAllFilesInFolder(dataFolderPath);