import React, { Component } from "react";
import PropTypes from "prop-types";
// import { MyContext } from "../components/store/createContext";

import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Select from "@material-ui/core/Select";

import Fdashboard from "./dashboard/fdashboard";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";
import { fetchClients } from "../components/store/actions";

const CustomTableCell = withStyles(() => ({
  head: {
    fontSize: 12,
    paddingLeft: 8,
    paddingRight: 8,
  },
  body: {
    fontSize: 11,
    paddingLeft: 8,
    paddingRight: 8,
  },
}))(TableCell);

const styles = (theme) => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
  },
});

class Report extends Component {
  state = {
    data: "",
    month: "",
    year: "",
    download: [],
  };

  async componentDidMount() {
    await this.props.dispatch(fetchClients());
    this.setState({
      year: new Date().getFullYear(),
    });
    try {
      await fetch("/api/transactionss", {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          this.setState({ data }, () => {
            // might wanna do something
          });
        });
    } catch (e) {
      console.log(e, "error getting transactions due to permissions");
    }
  }

  updatePost = (id) => {
    this.props.history.push("/transactions/" + id);
  };

  revMon = (month) => {
    let date = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return date[month];
  };

  getMon = (month) => {
    return "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(month) / 3 + 1;
  };

  handleChange = (e) => {
    const { data } = this.state;
    e.persist();
    this.setState({ [e.target.name]: e.target.value }, () => {
      let download = [];
      for (let i = 0; i < data.length; i++) {
        let transacb = {};
        let transacs = {};
        let dateMonth = new Date(data[i].trade_date).getMonth() + 1;
        let dateYear = new Date(data[i].trade_date).getFullYear();

        //loop buy side
        if (
          this.getMon(this.state.month) === dateMonth &&
          dateYear === parseInt(this.state.year)
        ) {
          let date = new Date(data[i].trade_date).toLocaleDateString();
          let size = data[i].volume;
          transacb.id = data[i].trade_id;
          transacb.trade_date = date;
          transacb.client = data[i].b_client;
          transacb.clientid = data[i].b_clientid;
          transacb.product = data[i].product;
          transacb.instrument = data[i].instrument;
          transacb.bs = "Buy";
          transacb.account = data[i].b_account;
          transacb.idb = data[i].b_idb;
          transacb.trader = data[i].b_trader;
          transacb.comms = data[i].b_commission;
          transacb.tcomms = Math.round(parseFloat(data[i].b_tcomm) * 100) / 100;
          transacb.price = data[i].price;
          transacb.strike = data[i].strike;
          transacb.qty = data[i].qty;
          transacb.size = size;
          transacb.contract = data[i].contract;
          transacb.deal_id = data[i].deal_id;
          transacb.broker = data[i].b_user;

          if (Object.keys(transacb).length) {
            download.push(transacb);
          }
        }
        //loop sell side
        if (
          this.getMon(this.state.month) === dateMonth &&
          dateYear === parseInt(this.state.year)
        ) {
          let date = new Date(data[i].trade_date).toLocaleDateString();
          let size = data[i].volume;
          transacs.id = data[i].trade_id;
          transacs.trade_date = date;
          transacs.client = data[i].s_client;
          transacs.clientid = data[i].s_clientid;
          transacs.product = data[i].product;
          transacs.instrument = data[i].instrument;
          transacs.bs = "Sell";
          transacs.account = data[i].s_account;
          transacs.idb = data[i].s_idb;
          transacs.trader = data[i].s_trader;
          transacs.comms = data[i].s_commission;
          transacs.tcomms = Math.round(parseFloat(data[i].s_tcomm) * 100) / 100;
          transacs.price = data[i].price;
          transacs.strike = data[i].strike;
          transacs.qty = data[i].qty;
          transacs.size = size;
          transacs.contract = data[i].contract;
          transacs.deal_id = data[i].deal_id;
          transacs.broker = data[i].s_user;

          if (Object.keys(transacs).length) {
            download.push(transacs);
          }
        }
      }
      // set state of download
      this.setState({ download }, () => {
        //testing
      });
    });
  };

  download = () => {
    const { download } = this.state;
    let arrayCsv = [];
    let header = [
      "Trade id",
      "Trade date",
      "Client",
      "Entity",
      "Product",
      "Instrument",
      "Buy/Sell",
      "Contract",
      "Price",
      "Strike",
      "Quantity",
      "Account",
      "Trader",
      "Comms Rate",
      "Broker",
      "Deal_id",
    ];
    arrayCsv.push(header);

    for (let i = 0; i < download.length; i++) {
      let entity = "";
      let clientname = "";
      for (let j = 0; j < this.props.clientsObj.length; j++) {
        if (this.props.clientsObj[j].id === this.state.download[i].clientid) {
          entity = this.props.clientsObj[j].entity;
          clientname = this.props.clientsObj[j].clients;
        }
      }

      let array = [];
      array.push(download[i].id);
      array.push(download[i].trade_date);
      array.push(clientname);
      array.push(entity);
      array.push(download[i].product);
      array.push(download[i].instrument);
      array.push(download[i].bs);
      array.push(download[i].contract);
      array.push(download[i].price);
      array.push(download[i].strike);
      array.push(download[i].size);
      array.push(download[i].account);
      array.push(download[i].trader);
      array.push(download[i].comms);
      array.push(Math.round(parseFloat(download[i].tcomms) * 100) / 100);
      array.push(download[i].broker);
      array.push(download[i].deal_id);
      arrayCsv.push(array);
    }
    let csvContent =
      "data:text/csv;charset=utf-8," +
      arrayCsv.map((e) => e.join(",")).join("\n");
    // var encodedUri = encodeURI(csvContent);
    window.open(csvContent);
  };

  render() {
    const { classes } = this.props;

    let year = (
      <FormControl className={classes.dateControl} variant="outlined">
        <InputLabel
          ref={(ref) => {
            this.InputLabelRef = ref;
          }}
        >
          Year
        </InputLabel>
        <Select
          native
          name="year"
          value={this.state.year}
          onChange={this.handleChange}
          input={
            <OutlinedInput name="year" labelWidth={this.state.labelWidth} />
          }
        >
          <option value="2019">2019</option>
          <option value="2020">2020</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </Select>
      </FormControl>
    );

    return (
      <React.Fragment>
        <Fdashboard>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <Button onClick={this.download} variant="contained" color="primary">
            Download CSV
          </Button>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <FormControl className={classes.dateControl} variant="outlined">
            <InputLabel
              ref={(ref) => {
                this.InputLabelRef = ref;
              }}
            >
              Month
            </InputLabel>
            <Select
              native
              name="month"
              value={this.state.month}
              onChange={this.handleChange}
              input={
                <OutlinedInput
                  name="month"
                  labelWidth={this.state.labelWidth}
                />
              }
            >
              <option value="Jan">Jan</option>
              <option value="Feb">Feb</option>
              <option value="Mar">Mar</option>
              <option value="Apr">Apr</option>
              <option value="May">May</option>
              <option value="Jun">Jun</option>
              <option value="Jul">Jul</option>
              <option value="Aug">Aug</option>
              <option value="Sep">Sep</option>
              <option value="Oct">Oct</option>
              <option value="Nov">Nov</option>
              <option value="Dec">Dec</option>
            </Select>
          </FormControl>
          {year}
          <Paper className={classes.root}>
            <Table style={{ width: 2500 }}>
              <TableHead>
                <TableRow>
                  <CustomTableCell align="center">Trade Id</CustomTableCell>
                  <CustomTableCell align="center">Trade date</CustomTableCell>
                  <CustomTableCell align="center">Client</CustomTableCell>
                  <CustomTableCell align="center">
                    Client entity
                  </CustomTableCell>
                  <CustomTableCell align="center">Product</CustomTableCell>
                  <CustomTableCell align="center">Instrument</CustomTableCell>
                  <CustomTableCell align="center">Buy/Sell</CustomTableCell>
                  <CustomTableCell align="center">Contract</CustomTableCell>
                  <CustomTableCell align="center">Price</CustomTableCell>
                  <CustomTableCell align="center">Strike</CustomTableCell>
                  <CustomTableCell align="center">Quantity</CustomTableCell>
                  <CustomTableCell align="center">Account</CustomTableCell>
                  <CustomTableCell align="center">Trader</CustomTableCell>
                  <CustomTableCell align="center">Comms Rate</CustomTableCell>
                  <CustomTableCell align="center">Total Comms</CustomTableCell>
                  <CustomTableCell align="center">Broker</CustomTableCell>
                  <CustomTableCell align="center">Deal ID</CustomTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.download.length > 0 &&
                  this.state.download.map((row) => {
                    let entity = "";
                    let clientname = "";
                    for (let i = 0; i < this.props.clientsObj.length; i++) {
                      if (this.props.clientsObj[i].id === row.clientid) {
                        entity = this.props.clientsObj[i].entity;
                        clientname = this.props.clientsObj[i].clients;
                      }
                    }
                    return (
                      <TableRow key={row.trade_id}>
                        <CustomTableCell
                          align="center"
                          component="th"
                          scope="row"
                        >
                          {row.id}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.trade_date}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {clientname}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {entity}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.product}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.instrument}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.bs}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.contract}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.price}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.strike}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.size}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.account}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.trader}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.comms}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {Math.round(parseFloat(row.tcomms) * 100) / 100}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.broker}
                        </CustomTableCell>
                        <CustomTableCell align="center">
                          {row.deal_id}
                        </CustomTableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Paper>
        </Fdashboard>
      </React.Fragment>
    );
  }
}

Report.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  clientsObj: state.clients.clientsObj,
  loading: state.clients.loading,
  error: state.clients.error,
});

export default connect(mapStateToProps)(withRouter(withStyles(styles)(Report)));
