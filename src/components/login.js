import React, { Component } from "react";
import { withRouter } from "react-router-dom";

import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  margin: {
    margin: theme.spacing.unit
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3
  },
  textField: {
    flexBasis: 200
  },
  button: {
    margin: theme.spacing.unit
  }
});

class Login extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClickShowPassword = this.handleClickShowPassword.bind(this);
    this.state = {
      name: "",
      password: "",
      username: "",
      showPassword: false
    };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleClickShowPassword() {
    this.setState(state => ({ showPassword: !state.showPassword }));
  }

  handleSubmit(event) {
    event.preventDefault();

    const data = {
      name: this.state.name,
      password: this.state.password
    };

    fetch("/users/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(data => {
        localStorage.setItem("token", data.token);
        this.props.history.push("/"); //props are inherent from router
      });
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <form onSubmit={this.handleSubmit}>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
              >
                <Grid item>
                  <FormControl
                    className={classNames(classes.margin, classes.textField)}
                  >
                    <InputLabel htmlFor="adornment-name">Username</InputLabel>
                    <Input
                      id="adornment-name"
                      name="name"
                      inputProps={{
                        "aria-label": "Name"
                      }}
                      onChange={this.handleChange}
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl
                    className={classNames(classes.margin, classes.textField)}
                  >
                    <InputLabel htmlFor="adornment-password">
                      Password
                    </InputLabel>
                    <Input
                      id="adornment-password"
                      type={this.state.showPassword ? "text" : "password"}
                      name="password"
                      onChange={this.handleChange}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="Toggle password visibility"
                            onClick={this.handleClickShowPassword}
                          >
                            {this.state.showPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
                <br />
                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.button}
                  >
                    Submit
                  </Button>
                </Grid>
                <br />
              </Grid>
            </Grid>
          </Grid>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(Login));
