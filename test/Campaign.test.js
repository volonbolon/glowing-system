const assert = require('assert');
const ganache = require('ganache-cli');
const Web3  = require('web3');
const web3 = new Web3(ganache.provider());
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let campaign;
let factory;
let campaignAddress;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    const parsedCompiledFactoryABI = compiledFactory.abi;
    const factoryBytecode = compiledFactory.evm.bytecode.object;
    const campaignABI = compiledCampaign.abi;
    
    factory = await new web3.eth.Contract(parsedCompiledFactoryABI)
    .deploy({data: factoryBytecode})
    .send({from: accounts[0], gas:'3000000'});

    await factory.methods.createCampaign('100')
    .send({from: accounts[0], gas:'3000000'});

    [campaignAddress] = await factory.methods.getDeployedCampaigns()
    .call();

    campaign = await new web3.eth.Contract(campaignABI, campaignAddress);
});

async function balanceForAccount(idx) {
    let  balance = await web3.eth.getBalance(accounts[idx]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);
    return balance;
}

describe('Campaigns', () => {
    it('deploys a contract', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager()
        .call();
        assert.equal(accounts[0], manager);
    });

    it('allows people to contribute and mark them as approvers', async () => {
        await campaign.methods.contribute()
        .send({
            value: '101',
            from: accounts[1]
        });
        const isContributor = await campaign.methods.approvers(accounts[1])
        .call();
        assert(isContributor);
    });

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute()
            .send({
                value: '99',
                from: accounts[1]
            });
            assert(false);
        } catch (error) {
            assert(error);
        }
    });

    it('allows a manager to make a payment request', async () => {
        const description = 'Buy Dildo';
        await campaign.methods.createRequest(description, '100', accounts[2])
        .send({from: accounts[0], gas:'3000000'});

        const request = await campaign.methods.requests(0).call();
        assert.equal(description, request.description);
    });

    it('process a request', async () => {
        const prevBalance = await balanceForAccount(1);

        await campaign.methods.contribute()
        .send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods
        .createRequest('Buy Dildo', web3.utils.toWei('8', 'ether'), accounts[1])
        .send({
            from: accounts[0], 
            gas:'3000000',
        });

        await campaign.methods.approveRequest(0)
        .send({
            from: accounts[0],
            gas: '3000000'
        });

        await campaign.methods.finalizeRequest(0)
        .send({
            from: accounts[0],
            gas: '3000000'
        });

        const balance = await balanceForAccount(1);

        assert(balance >= prevBalance + 8);
    });
});