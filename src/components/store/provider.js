import React, { Component } from "react";
import PropTypes from "prop-types";
import { Provider } from "./createContext";

// The provider, which holds the page-wide store and its actions.
// Feel free to abstract actions and state away from this file.
class AppProvider extends Component {
  state = {
    transactions: [],
    clients: JSON.parse(localStorage.getItem("clientsObj")),
    clientsdata: JSON.parse(localStorage.getItem("clients")),
    isLoggedin: localStorage.getItem("isLoggedin"),
    loggedIn: () => localStorage.setItem("isLoggedin", true),
    loggedOut: () => localStorage.setItem("isLoggedin", false),
  };

  async componentDidMount() {
    try {
      await fetch("/api/transactionss", {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((transactions) => {
          this.setState({ transactions });
        });

      await fetch("/api/clients", {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          let clients = [" "];
          let clientsObj = [];
          for (let i = 0; i < data.length; i++) {
            clients.push(data[i].client_name);
          }
          clients = [...new Set(clients)];
          for (let i = 0; i < clients.length; i++) {
            let address = "";
            let traders = [];
            let accounts = [];
            let recap_emails = "";
            let invoice_emails = "";
            let commission = 0;
            let commission_lp = 0;
            let idb = "";
            let id = "";
            let entity = "";
            let in_sg = 0;
            let duedate = 14;
            let deduct_broker_comms = "";

            for (let j = 0; j < data.length; j++) {
              if (data[j].client_name === clients[i]) {
                address = data[j].address;
                id = data[j].id;
                traders.push(data[j].trader_name);
                accounts.push(data[j].account);
                recap_emails = data[j].recap_emails;
                invoice_emails = data[j].invoice_emails;
                commission = data[j].commission;
                commission_lp = data[j].commission_lp;
                idb = data[j].idb;
                entity = data[j].entity;
                in_sg = data[j].in_sg;
                duedate = data[j].duedate;
                deduct_broker_comms = data[j].deduct_broker_comms;
              }
            }
            clientsObj.push({
              clients: clients[i],
              address: address,
              accounts: [...new Set(accounts)],
              traders: [...new Set(traders)],
              commission: commission,
              commission_lp: commission_lp,
              recap_emails: recap_emails,
              invoice_emails: invoice_emails,
              idb: idb,
              id: id,
              entity: entity,
              in_sg: in_sg,
              duedate: duedate,
              deduct_broker_comms: deduct_broker_comms,
            });
          }
          this.setState({ clients: clientsObj });
          localStorage.setItem("clientsObj", JSON.stringify(clientsObj));
          localStorage.setItem("clients", JSON.stringify(clients));
        });
    } catch (e) {
      console.log(e, "error getting transactions due to permissions");
    }
  }

  // addToFullCart(newItem) {
  //   let itemExisted = false
  //   let updatedCart = this.state.fullcart.map(item => {
  //     if (newItem.id === item.sku.id) {
  //       itemExisted = true
  //       return { sku: item.sku, quantity: ++item.quantity }
  //     } else {
  //       return item
  //     }
  //   })
  //   if (!itemExisted) {
  //     updatedCart = [...updatedCart, { sku: newItem, quantity: 1 }]
  //   }
  //   this.state.setFullCart(updatedCart)
  //   localStorage.setItem(
  //     'stripe_checkout_fullitems',
  //     JSON.stringify(updatedCart)
  //   )
  // }

  // remove(itemid) {
  //   let indexsplice
  //   let updatedCart = this.state.fullcart.map((item, index) => {
  //     if (itemid === item.sku.id && item.quantity > 1) {
  //       return { sku: item.sku, quantity: --item.quantity }
  //     } else if (itemid === item.sku.id && item.quantity === 1) {
  //       indexsplice = index
  //       return item
  //     } else {
  //       return item
  //     }
  //   })
  //   if (indexsplice !== undefined) {
  //     var removed = updatedCart.splice(indexsplice, 1)
  //     console.log('removinggggg')
  //   }
  //   console.log(updatedCart, 'checking if removed')
  //   this.state.setFullCart(updatedCart)
  //   localStorage.setItem(
  //     'stripe_checkout_fullitems',
  //     JSON.stringify(updatedCart)
  //   )
  // }

  render() {
    return <Provider value={this.state}>{this.props.children}</Provider>;
  }
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProvider;
