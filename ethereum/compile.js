const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

// Remove Build folder
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);
fs.ensureDirSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

var input = {
    language: 'Solidity',
    sources: {
        'Campaign.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*':['*'],
            },
        },
    },
};

var jsonInput = JSON.stringify(input);
var compiled = solc.compile(jsonInput);
var parsedOutput = JSON.parse(compiled);

const contracts = parsedOutput.contracts["Campaign.sol"];

for (let contract in contracts) {
    fs.outputJSONSync(path.resolve(buildPath, contract + '.json'), contracts[contract]);
}