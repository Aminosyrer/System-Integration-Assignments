const express = require('express');
const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const yaml = require('js-yaml');
const csv = require('csv-parser');
const axios = require('axios');

const app = express();
const port = 3000;

const dataFolderPath = path.join(__dirname, '..', 'Data');

function parseTextFile() {
    const data = fs.readFileSync(path.join(dataFolderPath, 'data.txt'), 'utf8').trim().split(/\r?\n\r?\n/);
    return data.map(person => {
        const details = person.split(/\r?\n/);
        const personData = {};
        details.forEach(detail => {
            const [key, value] = detail.split(': ');
            personData[key.toLowerCase()] = key.toLowerCase() === 'age' ? parseInt(value, 10) : value;
        });
        return personData;
    });
}

function parseXmlFile() {
    const data = fs.readFileSync(path.join(dataFolderPath, 'data.xml'), 'utf8');
    let parsedData;
    xml2js.parseString(data, (err, result) => {
        if (err) {
            throw err;
        }
        parsedData = result.people.person.map(person => {
            const personData = {};
            for (const [key, value] of Object.entries(person)) {
                personData[key] = key === 'age' ? parseInt(value[0], 10) : value[0];
            }
            return personData;
        });
    });
    return parsedData;
}

function parseYamlFile() {
    const data = fs.readFileSync(path.join(dataFolderPath, 'data.yml'), 'utf8');
    return yaml.load(data).person.map(person => {
        person.age = parseInt(person.age, 10);
        return person;
    });
}

function parseJsonFile() {
    const data = fs.readFileSync(path.join(dataFolderPath, 'data.json'), 'utf8');
    return JSON.parse(data).person.map(person => {
        person.age = parseInt(person.age, 10);
        return person;
    });
}

function parseCsvFile() {
    const parsedData = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(dataFolderPath, 'data.csv'))
            .pipe(csv())
            .on('data', (data) => {
                data.age = parseInt(data.age, 10);
                parsedData.push(data);
            })
            .on('end', () => {
                resolve(parsedData);
            });
    });
}

app.get('/data/text', (req, res) => {
    const data = parseTextFile();
    res.json(data);
});

app.get('/data/xml', (req, res) => {
    const data = parseXmlFile();
    res.json(data);
});

app.get('/data/yaml', (req, res) => {
    const data = parseYamlFile();
    res.json(data);
});

app.get('/data/json', (req, res) => {
    const data = parseJsonFile();
    res.json(data);
});

app.get('/data/csv', async (req, res) => {
    const data = await parseCsvFile();
    res.json(data);
});

app.get('/data/b/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const response = await axios.get(`http://localhost:5000/data/${type}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

app.listen(port, () => {
    console.log(`Server A running at http://localhost:${port}`);
});