import React, { Component } from "react";
import ReactDOM from "react-dom";
import { MyContext } from "../components/store/createContext";
import axios from "axios";
import { saveAs } from "file-saver";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const CustomTableCell = withStyles(() => ({
  head: {
    fontSize: 12,
    paddingLeft: 10,
    paddingRight: 10
  },
  body: {
    fontSize: 10,
    paddingLeft: 10,
    paddingRight: 10
  }
}))(TableCell);

const styles = theme => ({
  root: {
    display: "flex"
  },
  formControl: {
    margin: theme.spacing.unit * 3
  },
  dateControl: {
    minWidth: 120,
    maxWidth: 150
  }
});

class Client extends Component {
  state = {
    clients: [],
    clientarr: [],
    fromM: "",
    toM: "",
    year: "2019",
    exrate: 0.72,
    invoiceNo: "",
    disabled: true
  };

  componentDidMount() {
    // fetch(
    //   `https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=SGD&to_symbol=USD&apikey=${
    //     process.env.REACT_APP_AVAPI
    //   }`
    // )
    //   .then(res => res.json())
    //   .then(data => {
    //     let date = new Date();
    //     let month;
    //     let day;
    //     if (date.getMonth() + 1 < 10) {
    //       month = "0" + (date.getMonth() + 1);
    //     } else {
    //       month = date.getMonth() + 1;
    //     }
    //     if (date.getDate() < 10) {
    //       day = "0" + date.getDate();
    //     } else {
    //       day = date.getDate() - 1;
    //     }
    //     let dateformatted = date.getFullYear() + "-" + month + "-" + day;
    //     try {
    //       this.setState({
    //         exrate: parseFloat(
    //           data["Time Series FX (Daily)"][dateformatted]["4. close"]
    //         )
    //       });
    //     } catch (e) {
    //       console.log(e, "error");
    //     }
    //   });
    fetch("/api/invoice")
      .then(res => res.json())
      .then(data => {
        console.log(data, "data from invoice");
      });

    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
      toM: this.revMon(new Date().getMonth() - 1),
      fromM: this.revMon(new Date().getMonth() - 1),
      year: new Date().getFullYear()
    });

    let array = [...this.context.clients];
    let output = [];
    array.shift();
    for (let i = 0; i < array.length; i++) {
      let obj = {};
      obj.client = array[i].clients;
      obj.address = array[i].address;
      obj.invoice_emails = array[i].invoice_emails;
      obj.entity = array[i].entity;
      obj.id = array[i].id;
      obj.in_sg = array[i].in_sg;
      obj.duedate = array[i].duedate;
      obj.checked = false;
      output.push(obj);
    }
    this.setState({ clients: [...output] });
  }

  //   componentDidUpdate(prevProps, prevState) {
  //     if (this.state.clientarr !== prevState.clientarr) {
  //       this.fetchData(this.state.clientarr);
  //     }
  //   }

  range = (start, end) => {
    var ans = [];
    for (let i = start; i <= end; i++) {
      ans.push(i);
    }
    return ans;
  };

  revMon = month => {
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
      "Dec"
    ];
    return date[month];
  };

  getMon = month => {
    return "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(month) / 3 + 1;
  };

  handleChange = name => async event => {
    let clients = [...this.state.clients];
    for (let i = 0; i < clients.length; i++) {
      if (clients[i].id === name.id) {
        clients[i].checked = event.target.checked;
        break;
      }
    }
    await this.setState({
      clients: [...clients],
      disabled: true,
      invoiceNo: ""
    });

    const { transactions } = this.context;

    let rangearr = this.range(
      this.getMon(this.state.fromM),
      this.getMon(this.state.toM)
    );
    // set a new array for clientarr to go into pdf
    let clientarr = [];
    for (let i = 0; i < this.state.clients.length; i++) {
      if (this.state.clients[i].checked === true) {
        for (let j = 0; j < transactions.length; j++) {
          let transac = {};
          let dateMonth = new Date(transactions[j].trade_date).getMonth() + 1;
          if (
            transactions[j].b_clientid === clients[i].id &&
            rangearr.includes(dateMonth)
          ) {
            let size = transactions[j].qty;
            if (transactions[j].instrument === "S") {
              size = transactions[j].qty * 500 * transactions[j].consmonth;
            } else {
              size = transactions[j].qty * 100 * transactions[j].consmonth;
            }
            let date = new Date(
              transactions[j].trade_date
            ).toLocaleDateString();
            transac.id = transactions[j].trade_id;
            transac.address = clients[i].address;
            transac.entity = clients[i].entity;
            transac.in_sg = clients[i].in_sg;
            transac.duedate = clients[i].duedate;
            transac.invoice_emails = clients[i].invoice_emails;
            transac.trade_date = date;
            transac.client = clients[i].client;
            transac.product = transactions[j].product;
            transac.instrument = transactions[j].instrument;
            transac.bs = "Buy";
            transac.account = transactions[j].b_account;
            transac.idb = transactions[j].b_idb;
            transac.trader = transactions[j].b_trader;
            transac.comms = transactions[j].b_commission;
            transac.tcomms = parseFloat(transactions[j].b_commission) * size;
            transac.price = transactions[j].price;
            transac.strike = transactions[j].strike;
            transac.qty = transactions[j].qty;
            transac.size = size;
            transac.contract = transactions[j].contract;
            transac.deal_id = transactions[j].deal_id;
          }
          if (
            transactions[j].s_clientid === clients[i].id &&
            rangearr.includes(dateMonth)
          ) {
            let size = transactions[j].qty;
            if (transactions[j].instrument === "S") {
              size = transactions[j].qty * 500 * transactions[j].consmonth;
            } else {
              size = transactions[j].qty * 100 * transactions[j].consmonth;
            }
            let date = new Date(
              transactions[j].trade_date
            ).toLocaleDateString();
            transac.id = transactions[j].trade_id;
            transac.address = clients[i].address;
            transac.entity = clients[i].entity;
            transac.in_sg = clients[i].in_sg;
            transac.duedate = clients[i].duedate;
            transac.invoice_emails = clients[i].invoice_emails;
            transac.trade_date = date;
            transac.client = clients[i].client;
            transac.product = transactions[j].product;
            transac.instrument = transactions[j].instrument;
            transac.bs = "Sell";
            transac.account = transactions[j].s_account;
            transac.idb = transactions[j].s_idb;
            transac.trader = transactions[j].s_trader;
            transac.comms = transactions[j].s_commission;
            transac.tcomms = parseFloat(transactions[j].s_commission) * size;
            transac.price = transactions[j].price;
            transac.strike = transactions[j].strike;
            transac.qty = transactions[j].qty;
            transac.size = size;
            transac.contract = transactions[j].contract;
            transac.deal_id = transactions[j].deal_id;
          }
          if (Object.keys(transac).length) {
            clientarr.push(transac);
          }
        }
      }
    }
    this.setState({ clientarr });
    try {
      fetch("/api/invoice")
        .then(res => res.json())
        .then(data => {
          for (let i = 0; i < data.length; i++) {
            try {
              if (data[i].entity === clientarr[0].entity) {
                this.setState({
                  invoiceNo: `${data[i].number}`
                });
              }
            } catch (e) {
              console.log(e, "invoice entity === false");
            }
          }
        });
    } catch (e) {
      console.log(e, "invoice entity");
    }
    //invoice no.
  };

  handleChange1 = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  createPdf = () => {
    let dataState = {
      client: [...this.state.clientarr],
      exrate: this.state.exrate,
      invoiceNo: this.state.invoiceNo,
      fromM: this.state.fromM,
      toM: this.state.toM,
      year: this.state.year
    };
    axios
      .post("/createpdf", dataState)
      .then(() => axios.get("/getpdf", { responseType: "blob" }))
      .then(res => {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        saveAs(pdfBlob, `${this.state.invoiceNo}.pdf`);
        this.setState({ disabled: false });
        let entity = 1;
        if (this.state.clientarr[0].entity === "SG") {
          entity = 2;
        }
        let data = {
          entity: entity,
          number: parseInt(this.state.invoiceNo) + 1
        };
        fetch("/api/invoice", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        }).then(() => {
          console.log("successful in updating invoice");
        });
      });
  };

  sendPdf = () => {
    let data = {
      invoiceNo: this.state.invoiceNo,
      invoice_emails: this.state.clientarr[0].invoice_emails,
      client: this.state.clientarr[0].client,
      toM: this.state.toM,
      year: this.state.year
    };
    if (
      window.confirm(
        `
        Please ensure that Invoice Number is correct
        `
      )
    ) {
      fetch("/sendpdf", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(() => {
          alert("Email successfully sent");
        })
        .catch(error => {
          console.error("error: ", error);
          alert("Error in sending email, please try again");
        });
    }
  };

  render() {
    const { classes } = this.props;
    const { clients } = this.state;

    const disabled = this.state.disabled;

    let headers = [
      "Id",
      "Trade Date",
      "Client",
      "Product",
      "Instrument",
      "Buy/Sell",
      "Contract",
      "Price",
      "Strike",
      "Quantity",
      "Account",
      "Trader",
      "Comms",
      "Total Comms",
      "Deal Id"
    ];

    let year = (
      <FormControl className={classes.dateControl} variant="outlined">
        <InputLabel
          ref={ref => {
            this.InputLabelRef = ref;
          }}
        >
          Year
        </InputLabel>
        <Select
          native
          name="year"
          value={this.state.year}
          onChange={this.handleChange1}
          input={
            <OutlinedInput name="year" labelWidth={this.state.labelWidth} />
          }
        >
          <option value="2019" defaultValue>
            2019
          </option>
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
          <FormHelperText>Select only 1 client please</FormHelperText>
        </FormControl>

        <div>
          <br />
          <br />
          <FormControl className={classes.dateControl} variant="outlined">
            <InputLabel
              ref={ref => {
                this.InputLabelRef = ref;
              }}
            >
              From Month
            </InputLabel>
            <Select
              native
              name="fromM"
              value={this.state.fromM}
              onChange={this.handleChange1}
              input={
                <OutlinedInput
                  name="fromM"
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
          <FormControl className={classes.dateControl} variant="outlined">
            <InputLabel
              ref={ref => {
                this.InputLabelRef = ref;
              }}
            >
              To Month
            </InputLabel>
            <Select
              native
              name="toM"
              value={this.state.toM}
              onChange={this.handleChange1}
              input={
                <OutlinedInput name="toM" labelWidth={this.state.labelWidth} />
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
          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <TextField
            className={classes.textControl}
            label="SGD/USD"
            name="exrate"
            type="number"
            inputProps={{ step: 0.001, style: { width: 80 } }}
            value={this.state.exrate}
            onChange={this.handleChange1}
            variant="outlined"
          />
          <TextField
            className={classes.textControl}
            label="Invoice No."
            name="invoiceNo"
            inputProps={{ style: { width: 100 } }}
            value={this.state.invoiceNo}
            onChange={this.handleChange1}
            variant="outlined"
          />
          <br />
          <br />
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={this.createPdf}
            >
              Create PDF
            </Button>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.sendPdf}
              disabled={disabled}
            >
              Send PDF
            </Button>
          </div>
          <br />
          <br />
          <Paper className={classes.root}>
            <Table>
              <TableHead>
                <TableRow>
                  {headers.map((field, index) => (
                    <CustomTableCell align="center" key={index}>
                      {field}
                    </CustomTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.clientarr.map((client, index) => {
                  return (
                    <TableRow key={index}>
                      <CustomTableCell align="center">
                        {client.id}
                      </CustomTableCell>
                      <CustomTableCell align="center">
                        {client.trade_date}
                      </CustomTableCell>
                      <CustomTableCell align="center">
                        {client.client}
                      </CustomTableCell>
                      <CustomTableCell align="center">
                        {client.product}
                      </CustomTableCell>
                      <CustomTableCell align="center">
                        {client.instrument}
                      </CustomTableCell>
                      <CustomTableCell align="center">
                        {client.bs}
                      </CustomTableCell>
                      <CustomTableCell align="center">
                        {client.contract}
                      </CustomTableCell>
                      <CustomTableCell align="center">
                        {client.price}
                      </CustomTableCell>
                      <CustomTableCell align="center">
                        {client.strike}
                      </CustomTableCell>
                      <CustomTableCell align="center">
                        {client.size}
                      </CustomTableCell>
                      <CustomTableCell align="center">
                        {client.account}
                      </CustomTableCell>
                      <CustomTableCell align="center">
                        {client.trader}
                      </CustomTableCell>
                      <CustomTableCell align="center">
                        {client.comms}
                      </CustomTableCell>
                      <CustomTableCell align="center">
                        {client.tcomms}
                      </CustomTableCell>
                      <CustomTableCell align="center">
                        {client.deal_id}
                      </CustomTableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </div>
    );
  }
}

Client.contextType = MyContext;

Client.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Client);
