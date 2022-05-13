const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('../ethereum/build/CampaignFactory.json');

const nmeunic = 'merge menu camera edit evidence enroll water good barely number panel now';
const network = 'https://rinkeby.infura.io/v3/c668bcc8827d4dffb89b49f523338f4b';
const provider = new HDWalletProvider(nmeunic, network);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]); 

    const parsedCompiledFactoryABI = compiledFactory.abi;
    const factoryBytecode = compiledFactory.evm.bytecode.object;

    const result = await new web3.eth.Contract(parsedCompiledFactoryABI)
    .deploy({data: factoryBytecode})
    .send({from: accounts[0]});

    console.log('Contract deployed to', result.options.address);
};

deploy();

// Attempting to deploy from account 0xFD75a66C528AA8667Ceb94027516a3f4D2FcebF0
// Contract deployed to 0x82669fAd610d49aC1e14e366e175c24fdE1CaD7d
