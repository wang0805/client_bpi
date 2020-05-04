import React, { Component } from "react";
import PropTypes from "prop-types";
import { MyContext } from "../components/store/createContext";

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
    fontSize: 12,
    paddingLeft: 8,
    paddingRight: 8
  },
  body: {
    fontSize: 11,
    paddingLeft: 8,
    paddingRight: 8
  }
}))(TableCell);

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  }
});

class Blotter extends Component {
  state = { data: "" };

  async componentDidMount() {
    try {
      await fetch("/api/transactionss", {
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

  download = () => {
    let arrayCsv = [];
    let header = [
      "Trade id",
      "Trade date",
      "Trade time",
      "Product",
      "Instrument",
      "Client Buy",
      "Client Entity",
      "Comms Buy",
      "Buy Broker",
      "Client Sell",
      "Client Entity",
      "Comms Sell",
      "Sell Broker",
      "Contract",
      "Strike",
      "Price",
      "Quantity",
      "Quantity(MT)",
      "Buy Tcomms",
      "Sell Tcomms",
      "Total Comms",
      "Deal Id",
      "Created By"
    ];
    arrayCsv.push(header);

    for (let i = 0; i < this.state.data.length; i++) {
      let trade_date = new Date(
        this.state.data[i].trade_date
      ).toLocaleDateString();
      let size = this.state.data[i].qty;
      if (this.state.data[i].instrument === "S") {
        size = this.state.data[i].qty * 500 * this.state.data[i].consmonth;
      } else {
        size = this.state.data[i].qty * 100 * this.state.data[i].consmonth;
      }
      let totalComms =
        size * parseFloat(this.state.data[i].b_commission) +
        size * parseFloat(this.state.data[i].s_commission);

      let entityS = "";
      let entityB = "";
      for (let j = 0; j < this.context.clients.length; j++) {
        if (this.context.clients[j].id === this.state.data[i].b_clientid) {
          entityB = this.context.clients[j].entity;
        } else if (
          this.context.clients[j].id === this.state.data[i].s_clientid
        ) {
          entityS = this.context.clients[j].entity;
        }
      }

      let array = [];

      array.push(this.state.data[i].trade_id);
      array.push(trade_date);
      array.push(this.state.data[i].trade_time);
      array.push(this.state.data[i].product);
      array.push(this.state.data[i].instrument);
      array.push(this.state.data[i].b_client);
      array.push(entityB);
      array.push(this.state.data[i].b_commission);
      array.push(this.state.data[i].b_user);
      array.push(this.state.data[i].s_client);
      array.push(entityS);
      array.push(this.state.data[i].s_commission);
      array.push(this.state.data[i].s_user);
      array.push(this.state.data[i].contract);
      array.push(this.state.data[i].strike);
      array.push(this.state.data[i].price);
      array.push(this.state.data[i].qty);
      array.push(size);
      array.push(size * parseFloat(this.state.data[i].b_commission));
      array.push(size * parseFloat(this.state.data[i].s_commission));
      array.push(totalComms);
      array.push(this.state.data[i].deal_id);
      array.push(this.state.data[i].created_by);

      arrayCsv.push(array);
    }
    let csvContent =
      "data:text/csv;charset=utf-8," +
      arrayCsv.map(e => e.join(",")).join("\n");
    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  };

  render() {
    const { classes } = this.props;
    console.log(this.state.data, this.context, "data to be sent");

    return (
      <React.Fragment>
        <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <Button onClick={this.download} variant="contained" color="primary">
          Download CSV
        </Button>
        <Paper className={classes.root}>
          <Table style={{ width: 2500 }}>
            <TableHead>
              <TableRow>
                <CustomTableCell align="center">Trade Id</CustomTableCell>
                <CustomTableCell align="center">Trade date</CustomTableCell>
                <CustomTableCell align="center">Trade time</CustomTableCell>
                <CustomTableCell align="center">Product</CustomTableCell>
                <CustomTableCell align="center">Instrument</CustomTableCell>
                <CustomTableCell align="center">Client buy</CustomTableCell>
                <CustomTableCell align="center">Client entity</CustomTableCell>
                <CustomTableCell align="center">Comms buy</CustomTableCell>
                <CustomTableCell align="center">Buy broker</CustomTableCell>
                <CustomTableCell align="center">Client sell</CustomTableCell>
                <CustomTableCell align="center">Client entity</CustomTableCell>
                <CustomTableCell align="center">Comms sell</CustomTableCell>
                <CustomTableCell align="center">Sell broker</CustomTableCell>
                <CustomTableCell align="center">Contract</CustomTableCell>
                <CustomTableCell align="center">Strike</CustomTableCell>
                <CustomTableCell align="center">Price</CustomTableCell>
                <CustomTableCell align="center">Quantity</CustomTableCell>
                <CustomTableCell align="center">Quantity(MT)</CustomTableCell>
                <CustomTableCell align="center">Buy Tcomms</CustomTableCell>
                <CustomTableCell align="center">Sell Tcomms</CustomTableCell>
                <CustomTableCell align="center">
                  Total Commissions
                </CustomTableCell>
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
                this.state.data.map(row => {
                  let date = new Date(row.created_at);
                  let date_time =
                    date.toLocaleDateString() + " " + date.toLocaleTimeString();
                  let trade_date = new Date(
                    row.trade_date
                  ).toLocaleDateString();
                  let size = row.qty;
                  if (row.instrument === "S") {
                    size = row.qty * 500 * row.consmonth;
                  } else {
                    size = row.qty * 100 * row.consmonth;
                  }
                  let entityS = "";
                  let entityB = "";
                  for (let i = 0; i < this.context.clients.length; i++) {
                    if (this.context.clients[i].id === row.b_clientid) {
                      entityB = this.context.clients[i].entity;
                    } else if (this.context.clients[i].id === row.s_clientid) {
                      entityS = this.context.clients[i].entity;
                    }
                  }
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
                        {row.trade_time}
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
                        {entityB}
                      </CustomTableCell>
                      <CustomTableCell align="center">
                        {row.b_commission}
                      </CustomTableCell>
                      <CustomTableCell align="center">
                        {row.b_user}
                      </CustomTableCell>
                      <CustomTableCell align="center">
                        {row.s_client}
                      </CustomTableCell>
                      <CustomTableCell align="center">
                        {entityS}
                      </CustomTableCell>
                      <CustomTableCell align="center">
                        {row.s_commission}
                      </CustomTableCell>
                      <CustomTableCell align="center">
                        {row.s_user}
                      </CustomTableCell>
                      <CustomTableCell align="center">
                        {row.contract}
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
                      <CustomTableCell align="center">{size}</CustomTableCell>
                      <CustomTableCell align="center">
                        {size * parseFloat(row.b_commission)}
                      </CustomTableCell>
                      <CustomTableCell align="center">
                        {size * parseFloat(row.s_commission)}
                      </CustomTableCell>
                      <CustomTableCell align="center">
                        {size * parseFloat(row.b_commission) +
                          size * parseFloat(row.s_commission)}
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
                })}
            </TableBody>
          </Table>
        </Paper>
      </React.Fragment>
    );
  }
}

Blotter.contextType = MyContext;

Blotter.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Blotter);
