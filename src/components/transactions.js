import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  }
});

class Transactions extends Component {
  state = { data: "" };

  async componentDidMount() {
    try {
      await fetch("/api/transactions", {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token")
        }
      })
        .then(res => res.json())
        .then(data => {
          this.setState({ data });
        });
    } catch (e) {
      console.log(e, "error getting transactions due to permissions");
    }
  }

  updatePost = id => {
    this.props.history.push("/updateid/" + id);
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Trade_id</TableCell>
              <TableCell align="right">Trade_date</TableCell>
              <TableCell align="right">Product</TableCell>
              <TableCell align="right">Client_buy</TableCell>
              <TableCell align="right">Acct_buy</TableCell>
              <TableCell align="right">Trader_buy</TableCell>
              <TableCell align="right">Comms_buy</TableCell>
              <TableCell align="right">Client_sell</TableCell>
              <TableCell align="right">Acct_sell</TableCell>
              <TableCell align="right">Trader_sell</TableCell>
              <TableCell align="right">Comms_sell</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Contract</TableCell>
              <TableCell align="right">Year</TableCell>
              <TableCell align="right">Deal_id</TableCell>
              <TableCell align="right">Created_by</TableCell>
              <TableCell align="right">Created_at (GMT +8)</TableCell>
              <TableCell align="right">Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.data.length > 0 &&
              this.state.data.map(row => {
                let date = new Date(row.created_at);
                let date_time =
                  date.toLocaleDateString() + " " + date.toLocaleTimeString();
                return (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="right">
                      {row.trade_date.substring(0, 10)}
                    </TableCell>
                    <TableCell align="right">{row.product}</TableCell>
                    <TableCell align="right">{row.b_client}</TableCell>
                    <TableCell align="right">{row.b_account}</TableCell>
                    <TableCell align="right">{row.b_trader}</TableCell>
                    <TableCell align="right">{row.b_commission}</TableCell>
                    <TableCell align="right">{row.s_client}</TableCell>
                    <TableCell align="right">{row.s_account}</TableCell>
                    <TableCell align="right">{row.s_trader}</TableCell>
                    <TableCell align="right">{row.s_commission}</TableCell>
                    <TableCell align="right">{row.price}</TableCell>
                    <TableCell align="right">{row.qty}</TableCell>
                    <TableCell align="right">{row.contract}</TableCell>
                    <TableCell align="right">{row.year}</TableCell>
                    <TableCell align="right">{row.deal_id}</TableCell>
                    <TableCell align="right">{row.created_by_id}</TableCell>
                    <TableCell align="right">{date_time}</TableCell>
                    <TableCell align="right">
                      <button onClick={() => this.updatePost(row.id)}>
                        Edit
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

Transactions.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Transactions);
