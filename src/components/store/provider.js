import React, { Component } from "react";
import PropTypes from "prop-types";
import { Provider } from "./createContext";

// The provider, which holds the page-wide store and its actions.
// Feel free to abstract actions and state away from this file.
class AppProvider extends Component {
  state = {
    // fullcart: [],
    // setFullCart: items => this.setState({ fullcart: items }),
    // addToFullCart: this.addToFullCart.bind(this),
    // remove: this.remove.bind(this),
  };

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
  children: PropTypes.node.isRequired
};

export default AppProvider;
