import web3 from "./web3";
import campaignFactory from "./build/CampaignFactory.json";

const abi = campaignFactory.abi;
const instance = new web3.eth.Contract(abi, "0xbb8B8C8D15Fe460219Ae696B52987806060f0600");

export default instance;