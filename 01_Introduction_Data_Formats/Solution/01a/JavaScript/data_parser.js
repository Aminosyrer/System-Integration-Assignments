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
            personData[key.toLowerCase()] = key.toLowerCase() === 'age' ? parseInt(value, 10) : value;
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
                personData[key] = key === 'age' ? parseInt(value[0], 10) : value[0];
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
    const parsedData = yaml.load(data).person.map(person => {
        person.age = parseInt(person.age, 10);
        return person;
    });
    console.log("YAML data:");
    console.log({ person: parsedData });
    console.log("");
}

function parseJsonFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    const parsedData = JSON.parse(data).person.map(person => {
        person.age = parseInt(person.age, 10);
        return person;
    });
    console.log("JSON data:");
    console.log({ person: parsedData });
    console.log("");
}

function parseCsvFile(filePath) {
    const parsedData = [];
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
            data.age = parseInt(data.age, 10);
            parsedData.push(data);
        })
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