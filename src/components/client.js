import React, { Component } from "react";
import { MyContext } from "../components/store/createContext";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";

const styles = theme => ({
  root: {
    display: "flex"
  },
  formControl: {
    margin: theme.spacing.unit * 3
  }
});

class Client extends Component {
  state = {
    clients: []
  };

  componentDidMount() {
    let array = [...this.context.clients];
    let output = [];
    array.shift();
    for (let i = 0; i < array.length; i++) {
      let obj = {};
      obj.client = array[i].clients;
      obj.id = array[i].id;
      obj.checked = false;
      output.push(obj);
    }
    this.setState({ clients: [...output] });
  }

  handleChange = name => event => {
    let clients = [...this.state.clients];
    for (let i = 0; i < clients.length; i++) {
      if (clients[i].id === name.id) {
        clients[i].checked = event.target.checked;
        break;
      }
    }
    this.setState({ clients: [...clients] });
  };

  render() {
    const { classes } = this.props;
    const { clients } = this.state;
    const { transactions } = this.context;

    // console.log(this.context.transactions);
    // console.log(clients, "clients");

    let headers = [
      "Id",
      "Trade Date",
      "Client",
      "Product",
      "Buy/Sell",
      "Account",
      "Idb",
      "Trader",
      "Comms",
      "Total Comms",
      "Price",
      "Strike",
      "Quantity",
      "Contract"
    ];
    let clientarr = [];
    for (let i = 0; i < clients.length; i++) {
      if (clients[i].checked === true) {
        for (let j = 0; j < transactions.length; j++) {
          let transac = {};
          if (transactions[j].b_clientid === clients[i].id) {
            let size = transactions[j].qty;
            if (transactions[j].instrument === "S") {
              size = transactions[j].qty * 500 * transactions[j].consmonth;
            } else {
              size = transactions[j].qty * 100 * transactions[j].consmonth;
            }
            let date = new Date(
              transactions[j].trade_date
            ).toLocaleDateString();
            transac.id = transactions[j].trade_id;
            transac.trade_date = date;
            transac.client = transactions[j].b_client;
            transac.product = transactions[j].product;
            transac.bs = "Buy";
            transac.account = transactions[j].b_account;
            transac.idb = transactions[j].b_idb;
            transac.trader = transactions[j].b_trader;
            transac.comms = transactions[j].b_commission;
            transac.tcomms = parseFloat(transactions[j].b_commission) * size;
            transac.price = transactions[j].price;
            transac.strike = transactions[j].strike;
            transac.qty = transactions[j].qty;
            transac.size = size;
            transac.contract = transactions[j].contract;
          }
          if (transactions[j].s_clientid === clients[i].id) {
            let size = transactions[j].qty;
            if (transactions[j].instrument === "S") {
              size = transactions[j].qty * 500 * transactions[j].consmonth;
            } else {
              size = transactions[j].qty * 100 * transactions[j].consmonth;
            }
            let date = new Date(
              transactions[j].trade_date
            ).toLocaleDateString();
            transac.id = transactions[j].trade_id;
            transac.trade_date = date;
            transac.client = transactions[j].s_client;
            transac.product = transactions[j].product;
            transac.bs = "Sell";
            transac.account = transactions[j].s_account;
            transac.idb = transactions[j].s_idb;
            transac.trader = transactions[j].s_trader;
            transac.comms = transactions[j].s_commission;
            transac.tcomms = parseFloat(transactions[j].s_commission) * size;
            transac.price = transactions[j].price;
            transac.strike = transactions[j].strike;
            transac.qty = transactions[j].qty;
            transac.size = size;
            transac.contract = transactions[j].contract;
          }
          if (Object.keys(transac).length) {
            clientarr.push(transac);
          }
        }
      }
    }
    console.log(clientarr, "clients array");

    return (
      <div className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Select Clients</FormLabel>
          <FormGroup>
            {clients.map((client, index) => {
              return (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={client.checked}
                      onChange={this.handleChange(client)}
                      value={client.client}
                    />
                  }
                  label={client.client}
                />
              );
            })}
          </FormGroup>
          <FormHelperText>Be careful</FormHelperText>
        </FormControl>
        <table>
          <tr>
            {headers.map((field, index) => (
              <th key={index}>{field}</th>
            ))}
          </tr>

          {clientarr.map((client, index) => {
            return (
              <tr>
                <td>{client.id}</td>
                <td>{client.trade_date}</td>
                <td>{client.client}</td>
                <td>{client.product}</td>
                <td>{client.bs}</td>
                <td>{client.account}</td>
                <td>{client.idb}</td>
                <td>{client.trader}</td>
                <td>{client.comms}</td>
                <td>{client.tcomms}</td>
                <td>{client.price}</td>
                <td>{client.strike}</td>
                <td>{client.size}</td>
                <td>{client.contract}</td>
              </tr>
            );
          })}
        </table>
      </div>
    );
  }
}

Client.contextType = MyContext;

Client.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Client);
