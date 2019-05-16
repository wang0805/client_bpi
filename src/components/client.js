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
      obj.client = array.clients;
      obj.id = array.id;
      obj.checked = false;
      output.push(obj);
    }
    this.setState({ clients: [...output] });
  }

  handleChange = name => event => {
    let clients = [...this.state.clients];
    for (let i = 0; i < clients.length; i++) {
      if (clients[i] === name) {
        clients[i][Object.keys(clients[i])[0]] = event.target.checked;
      }
    }
    this.setState({ clients: [...clients] });
  };

  render() {
    const { classes } = this.props;
    const { clients } = this.state;

    console.log(this.context);

    let headers = [
      "Id",
      "Trade Date",
      "Client",
      "Product",
      "Buy/Sell",
      "Account",
      "Idb",
      "Trader",
      "Commission",
      "Price",
      "Strike",
      "Quantity",
      "Contract"
    ];

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
      </div>
    );
  }
}

Client.contextType = MyContext;

Client.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Client);
