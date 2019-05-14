import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";

const CustomTableCell = withStyles(() => ({
  head: {
    fontSize: 12
  },
  body: {
    fontSize: 11
  }
}))(TableCell);

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
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
    console.log(this.state.data, "transactions");
  }

  updatePost = id => {
    this.props.history.push("/updateid/" + id);
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <Table style={{ width: 3000 }}>
          <TableHead>
            <TableRow>
              <CustomTableCell>Trade Id</CustomTableCell>
              <CustomTableCell align="right">Trade date</CustomTableCell>
              <CustomTableCell align="right">Product</CustomTableCell>
              <CustomTableCell align="right">Instrument</CustomTableCell>
              <CustomTableCell align="right">Client buy</CustomTableCell>
              <CustomTableCell align="right">Acct buy</CustomTableCell>
              <CustomTableCell align="right">Trader buy</CustomTableCell>
              <CustomTableCell align="right">Comms buy</CustomTableCell>
              <CustomTableCell align="right">Client sell</CustomTableCell>
              <CustomTableCell align="right">Acct sell</CustomTableCell>
              <CustomTableCell align="right">Trader sell</CustomTableCell>
              <CustomTableCell align="right">Comms sell</CustomTableCell>
              <CustomTableCell align="right">Strike</CustomTableCell>
              <CustomTableCell align="right">Price</CustomTableCell>
              <CustomTableCell align="right">Quantity</CustomTableCell>
              <CustomTableCell align="right">Contract</CustomTableCell>
              <CustomTableCell align="right">Deal Id</CustomTableCell>
              <CustomTableCell align="right">Created by</CustomTableCell>
              <CustomTableCell align="right">
                Created at (GMT +8)
              </CustomTableCell>
              <CustomTableCell align="right">Edit</CustomTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.data.length > 0 &&
              this.state.data.map(row => {
                let date = new Date(row.created_at);
                let date_time =
                  date.toLocaleDateString() + " " + date.toLocaleTimeString();
                let trade_date = new Date(row.trade_date).toLocaleDateString();
                return (
                  <TableRow key={row.trade_id}>
                    <CustomTableCell component="th" scope="row">
                      {row.trade_id}
                    </CustomTableCell>
                    <CustomTableCell align="right">
                      {trade_date}
                    </CustomTableCell>
                    <CustomTableCell align="right">
                      {row.product}
                    </CustomTableCell>
                    <CustomTableCell align="right">
                      {row.instrument}
                    </CustomTableCell>
                    <CustomTableCell align="right">
                      {row.b_client}
                    </CustomTableCell>
                    <CustomTableCell align="right">
                      {row.b_account}
                    </CustomTableCell>
                    <CustomTableCell align="right">
                      {row.b_trader}
                    </CustomTableCell>
                    <CustomTableCell align="right">
                      {row.b_commission}
                    </CustomTableCell>
                    <CustomTableCell align="right">
                      {row.s_client}
                    </CustomTableCell>
                    <CustomTableCell align="right">
                      {row.s_account}
                    </CustomTableCell>
                    <CustomTableCell align="right">
                      {row.s_trader}
                    </CustomTableCell>
                    <CustomTableCell align="right">
                      {row.s_commission}
                    </CustomTableCell>
                    <CustomTableCell align="right">
                      {row.strike}
                    </CustomTableCell>
                    <CustomTableCell align="right">{row.price}</CustomTableCell>
                    <CustomTableCell align="right">{row.qty}</CustomTableCell>
                    <CustomTableCell align="right">
                      {row.contract}
                    </CustomTableCell>
                    <CustomTableCell align="right">
                      {row.deal_id}
                    </CustomTableCell>
                    <CustomTableCell align="right">
                      {row.created_by}
                    </CustomTableCell>
                    <CustomTableCell align="right">{date_time}</CustomTableCell>
                    <CustomTableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => this.updatePost(row.trade_id)}
                      >
                        Edit
                      </Button>
                    </CustomTableCell>
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
