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
//unable to import props from index.js so have to use withRouter
import { withRouter } from "react-router-dom";
import Fdashboard from "./dashboard/fdashboard";

const CustomTableCell = withStyles(() => ({
  head: {
    fontSize: 12,
    paddingLeft: 10,
    paddingRight: 10,
  },
  body: {
    fontSize: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
}))(TableCell);

const styles = (theme) => ({
  root: {
    // marginTop: theme.spacing.unit * 3,
    // overflowX: "auto"
    display: "flex",
  },
});

class Transactions extends Component {
  state = { data: "" };

  async componentDidMount() {
    console.log(this.props, "props of transactions");
    try {
      await fetch("/api/transactions", {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          this.setState({ data });
        });
    } catch (e) {
      console.log(e, "error getting transactions due to permissions");
    }
  }

  updatePost = (id) => {
    this.props.history.push("/updateid/" + id);
  };

  render() {
    const { classes } = this.props;

    return (
      <Fdashboard>
        <Paper className={classes.root}>
          <Table>
            <TableHead>
              <TableRow>
                <CustomTableCell align="center">Trade Id</CustomTableCell>
                <CustomTableCell align="center">Trade date</CustomTableCell>
                <CustomTableCell align="center">Product</CustomTableCell>
                <CustomTableCell align="center">Instrument</CustomTableCell>
                <CustomTableCell align="center">Client buy</CustomTableCell>
                <CustomTableCell align="center">Acct buy</CustomTableCell>
                <CustomTableCell align="center">Trader buy</CustomTableCell>
                <CustomTableCell align="center">Comms buy</CustomTableCell>
                <CustomTableCell align="center">Client sell</CustomTableCell>
                <CustomTableCell align="center">Acct sell</CustomTableCell>
                <CustomTableCell align="center">Trader sell</CustomTableCell>
                <CustomTableCell align="center">Comms sell</CustomTableCell>
                <CustomTableCell align="center">Strike</CustomTableCell>
                <CustomTableCell align="center">Price</CustomTableCell>
                <CustomTableCell align="center">Quantity</CustomTableCell>
                <CustomTableCell align="center">Contract</CustomTableCell>
                <CustomTableCell align="center">Deal Id</CustomTableCell>
                <CustomTableCell align="center">Created by</CustomTableCell>
                <CustomTableCell align="center">
                  Created at (GMT +8)
                </CustomTableCell>
                <CustomTableCell align="center">Edit</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.data.length > 0 &&
                this.state.data.map((row) => {
                  let date = new Date(row.created_at);
                  let now = new Date();
                  let date_time =
                    date.toLocaleDateString() + " " + date.toLocaleTimeString();
                  let trade_date = new Date(
                    row.trade_date
                  ).toLocaleDateString();
                  // make sure date and month of creation same
                  if (
                    date.getDate() === now.getDate() &&
                    date.getMonth() === now.getMonth()
                  ) {
                    return (
                      <TableRow key={row.trade_id}>
                        <CustomTableCell
                          align="center"
                          component="th"
                          scope="row"
                        >
                          {row.trade_id}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {trade_date}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.product}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.instrument}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.b_client}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.b_account}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.b_trader}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.b_commission}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.s_client}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.s_account}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.s_trader}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.s_commission}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.strike}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.price}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.qty}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.contract}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.deal_id}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.created_by}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {date_time}
                        </CustomTableCell>
                        <CustomTableCell align="center">
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
                  } else {
                    return null;
                  }
                })}
            </TableBody>
          </Table>
        </Paper>
      </Fdashboard>
    );
  }
}

Transactions.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Transactions));
