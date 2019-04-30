import React, { Component } from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  card: {
    maxWidth: 500,
    marginTop: 50
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
};

class Edit extends Component {
  state = { data: "", tradeid: "", dealid: "" };

  async componentDidMount() {
    await fetch(`/api/transactions/${this.props.match.params.id}`)
      .then(res => res.json())
      .then(data => {
        this.setState({ data });
        this.setState({ tradeid: data.id });
        this.setState({ dealid: data.deal_id });
      });

    console.log(this.state.data, "edit data");
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  return = () => {
    this.props.history.push("/");
  };

  handleSubmit = e => {
    e.preventDefault();

    const data = { ...this.state };
    fetch(`/api/transactions/${this.state.tradeid}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(() => {
      console.log("success posting deal_id");
      this.props.history.push("/");
    });
  };

  render() {
    const { classes } = this.props;
    let data = this.state.data;
    // console.log(typeof data.trade_date);
    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          <form onSubmit={this.handleSubmit}>
            <CardContent>
              <Typography component="h2">
                <div>Trade_id: {data.id}</div>
                <div>
                  Trade_date:{" "}
                  {data.trade_date && data.trade_date.substring(0, 10)}
                </div>
                <div>Trade_time: {data.trade_time}</div>
                <div>Client_buy: {data.b_client}</div>
                <div>Account_buy: {data.b_account}</div>
                <div>Trader_buy: {data.b_trader}</div>
                <div>Comms_buy: {data.b_commission}</div>
                <br />
                <div>Client_sell: {data.s_client}</div>
                <div>Account_sell: {data.s_account}</div>
                <div>Trader_sell: {data.s_trader}</div>
                <div>Comms_sell: {data.s_commission}</div>
                <br />
                <div>Contract: {data.contract}</div>
                <div>Price: {data.price}</div>
                <div>Strike: {data.strike}</div>
                <div>Instrument: {data.instrument}</div>
                <div>Quantity: {data.qty}</div>
                <br />
                <div>
                  <label>Deal id:</label>
                  <input
                    type="number"
                    name="dealid"
                    value={this.state.dealid}
                    onChange={this.handleChange}
                  />
                </div>
              </Typography>
            </CardContent>
            <CardActions>
              <Button color="primary" type="submit">
                Submit
              </Button>
              <Button onClick={this.return}>back</Button>
            </CardActions>
          </form>
        </Card>
      </div>
      //    <Paper className={classes.root}>
      //    <Table className={classes.table}>
      //      <TableHead>
      //        <TableRow>
      //          <TableCell>Trade_id</TableCell>
      //          <TableCell align="right">Trade_date</TableCell>
      //          <TableCell align="right">Trade_time</TableCell>
      //          <TableCell align="right">Client_buy</TableCell>
      //          <TableCell align="right">Account_buy</TableCell>
      //        </TableRow>
      //      </TableHead>
      //      <TableBody>
      //        {rows.map(row => (
      //          <TableRow key={row.id}>
      //            <TableCell component="th" scope="row">
      //              {row.name}
      //            </TableCell>
      //            <TableCell align="right">{row.calories}</TableCell>
      //            <TableCell align="right">{row.fat}</TableCell>
      //            <TableCell align="right">{row.carbs}</TableCell>
      //            <TableCell align="right">{row.protein}</TableCell>
      //          </TableRow>
      //        ))}
      //      </TableBody>
      //    </Table>
      //  </Paper>
    );
  }
}

Edit.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Edit);
