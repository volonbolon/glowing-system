import React, { Component } from "react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import { Card } from "semantic-ui-react";
import web3 from "../../ethereum/web3";

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const address = props.query.address;
    const campaign = Campaign(address);
    const summary = await campaign.methods.getSummary().call();

    return {
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      manager: summary[4],
    };
  }

  renderCards() {
    const items = [
        {
            style: { overflowWrap: 'break-word'},
            header: this.props.manager,
            meta: "Address of Manager",
            description: "The Manager created this campaign and can create requests to withdraw coins",
        },
        {
            header: this.props.minimumContribution,
            meta: "Minimum Contribution (wei)",
            description: "You must contribute at least this much wei to become and approver",
        },
        {
            header: this.props.requestsCount,
            meta: "Number of requests",
            description: "A request tries to withdraw coins from the contract",
        },
        {
            header: this.props.approversCount,
            meta: "Number of approvers",
            description: "Number of people who already donated to this campaign",
        },
        {
            header: web3.utils.fromWei(this.props.balance, 'ether'),
            meta: "Balance",
            description: "The balance is how much money was raised",
        },
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Campaign Details</h3>
        {this.renderCards()}
      </Layout>
    );
  }
}

export default CampaignShow;
