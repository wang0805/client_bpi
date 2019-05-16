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
    clients: {}
  };

  componentDidMount() {
    let array = [...this.context.clients];
    let obj = {};
    array.shift();
    for (let i = 0; i < array.length; i++) {
      console.log(array[i]);
      obj[array[i]] = false;
    }
    this.setState({ clients: { ...obj } });
  }

  handleChange = name => event => {
    console.log(name);
    let clients = { ...this.state.clients };
    console.log(event.target.checked);
    clients[name] = event.target.checked;
    console.log(clients);
    this.setState({ clients: { ...clients } });
  };

  render() {
    const { classes } = this.props;
    console.log(this.state.clients);
    console.log(this.context);

    // for(let i = 0; i<)

    return (
      <div className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Select Clients</FormLabel>
          <FormGroup>
            {Object.keys(this.state.clients).map((client, index) => {
              return (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={this.state.clients[client]}
                      onChange={this.handleChange(client)}
                      value={client}
                    />
                  }
                  label={client}
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
