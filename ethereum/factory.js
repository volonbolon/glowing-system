import web3 from "./web3";
import campaignFactory from "./build/CampaignFactory.json";

const abi = campaignFactory.abi;
const instance = new web3.eth.Contract(abi, "0x82669fAd610d49aC1e14e366e175c24fdE1CaD7d");

export default instance;