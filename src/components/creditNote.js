import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { saveAs } from "file-saver";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
// import FormLabel from "@material-ui/core/FormLabel";
// import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
// import FormHelperText from "@material-ui/core/FormHelperText";
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

import Fdashboard from "./dashboard/fdashboard";

import { connect } from "react-redux";
import { fetchClients } from "../components/store/actions";

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
    display: "flex",
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  dateControl: {
    minWidth: 120,
    maxWidth: 150,
  },
});

class Creditnote extends Component {
  state = {
    clients: [],
    clientarr: [], //all trades
    selectedClienrarr: [], // this one is for checked trades only
    fromM: "",
    toM: "",
    year: 2020,
    exrate: 0.72,
    invoiceNo: 0,
    invoiceNoSG: 0,
    invoiceNoHK: 0,
    invoiceNoUK: 0,
    disabled: true,
    transactions: [],
    tradeId: 0,
    client_id: 0,
    client: {},
    allCheck: true,
  };

  async componentDidMount() {
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
    await this.props.dispatch(fetchClients());
    await fetch("/api/transactionss", {
      method: "GET",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((transactions) => {
        this.setState({ transactions });
      });
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
      toM: this.revMon(new Date().getMonth()),
      fromM: this.revMon(new Date().getMonth()),
      year: new Date().getFullYear(),
    });
    let array = [...this.props.clientsObj];
    let output = [{client: "Dropdown to select Clients"},];
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
      obj.deduct_broker_comms = array[i].deduct_broker_comms;
      obj.checked = false;
      output.push(obj);
    }
    this.setState({ clients: [...output] });
  }

  range = (start, end) => {
    var ans = [];
    for (let i = start; i <= end; i++) {
      ans.push(i);
    }
    return ans;
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

  // oldhandleChange = (name) => async (event) => {
  //   const { transactions } = this.state;

  //   let clients = [...this.state.clients];
  //   for (let i = 0; i < clients.length; i++) {
  //     if (clients[i].id === name.id) {
  //       clients[i].checked = event.target.checked;
  //       break;
  //     }
  //   }
  //   await this.setState({
  //     clients: [...clients],
  //     disabled: true,
  //   });

  //   let rangearr = this.range(
  //     this.getMon(this.state.fromM),
  //     this.getMon(this.state.toM)
  //   );
  //   let clientarr = [];

  //   // set a new array for clientarr to go into pdf
  //   for (let i = 0; i < this.state.clients.length; i++) {
  //     if (this.state.clients[i].checked === true) {
  //       // clientarr = [] if u want only 1 client to show
  //       // clientarr = [];
  //       for (let j = 0; j < transactions.length; j++) {
  //         let transac = {};
  //         let dateMonth = new Date(transactions[j].trade_date).getMonth() + 1;
  //         let dateYear = new Date(transactions[j].trade_date).getFullYear();
  //         if (
  //           transactions[j].b_clientid === clients[i].id &&
  //           rangearr.includes(dateMonth) &&
  //           dateYear === parseInt(this.state.year)
  //         ) {
  //           let size = transactions[j].volume;
  //           // let size = transactions[j].qty;
  //           // if (transactions[j].instrument === "S") {
  //           //   size = transactions[j].qty * 500 * transactions[j].consmonth;
  //           // } else {
  //           //   size = transactions[j].qty * 100 * transactions[j].consmonth;
  //           // }
  //           let date = new Date(
  //             transactions[j].trade_date
  //           ).toLocaleDateString();
  //           transac.id = transactions[j].trade_id;
  //           transac.address = clients[i].address;
  //           transac.entity = clients[i].entity;
  //           transac.in_sg = clients[i].in_sg;
  //           transac.duedate = clients[i].duedate;
  //           transac.invoice_emails = clients[i].invoice_emails;
  //           transac.trade_date = date;
  //           transac.client = clients[i].client;
  //           transac.product = transactions[j].product;
  //           transac.instrument = transactions[j].instrument;
  //           transac.bs = "Buy";
  //           transac.account = transactions[j].b_account;
  //           transac.idb = transactions[j].b_idb;
  //           transac.trader = transactions[j].b_trader;
  //           transac.comms = transactions[j].b_commission;
  //           transac.tcomms =
  //             Math.round(
  //               parseFloat(transactions[j].b_commission) * size * 100
  //             ) / 100;
  //           transac.price = transactions[j].price;
  //           transac.strike = transactions[j].strike;
  //           transac.qty = transactions[j].qty;
  //           transac.size = size;
  //           transac.contract = transactions[j].contract;
  //           transac.deal_id = transactions[j].deal_id;
  //           transac.deduct_broker_comms = clients[i].deduct_broker_comms;
  //         }
  //         if (
  //           transactions[j].s_clientid === clients[i].id &&
  //           rangearr.includes(dateMonth) &&
  //           dateYear === parseInt(this.state.year)
  //         ) {
  //           let size = transactions[j].volume;
  //           // let size = transactions[j].qty;
  //           // if (transactions[j].instrument === "S") {
  //           //   size = transactions[j].qty * 500 * transactions[j].consmonth;
  //           // } else {
  //           //   size = transactions[j].qty * 100 * transactions[j].consmonth;
  //           // }
  //           let date = new Date(
  //             transactions[j].trade_date
  //           ).toLocaleDateString();
  //           transac.id = transactions[j].trade_id;
  //           transac.address = clients[i].address;
  //           transac.entity = clients[i].entity;
  //           transac.in_sg = clients[i].in_sg;
  //           transac.duedate = clients[i].duedate;
  //           transac.invoice_emails = clients[i].invoice_emails;
  //           transac.trade_date = date;
  //           transac.client = clients[i].client;
  //           transac.product = transactions[j].product;
  //           transac.instrument = transactions[j].instrument;
  //           transac.bs = "Sell";
  //           transac.account = transactions[j].s_account;
  //           transac.idb = transactions[j].s_idb;
  //           transac.trader = transactions[j].s_trader;
  //           transac.comms = transactions[j].s_commission;
  //           transac.tcomms =
  //             Math.round(
  //               parseFloat(transactions[j].s_commission) * size * 100
  //             ) / 100;
  //           transac.price = transactions[j].price;
  //           transac.strike = transactions[j].strike;
  //           transac.qty = transactions[j].qty;
  //           transac.size = size;
  //           transac.contract = transactions[j].contract;
  //           transac.deal_id = transactions[j].deal_id;
  //           transac.deduct_broker_comms = clients[i].deduct_broker_comms;
  //         }
  //         if (Object.keys(transac).length) {
  //           clientarr.push(transac);
  //         }
  //       }
  //     }
  //   }
  //   await this.setState({ clientarr });
  // };

  handleChange4 = (e) => {
    // uncheck the selected clients > put the unselected clients into a new [] selectedclientarr
    const {clientarr} = this.state
    // console.log(name, clientarr)
    for (let i = 0; i < clientarr.length; i++){
      clientarr[i].checked = e.target.checked;
    }
    this.setState({
      clientarr: [...clientarr],
      allCheck: e.target.checked,
    })
  }

  handleChange3 = (name) => async (e) => {
    // uncheck the selected clients > put the unselected clients into a new [] selectedclientarr
    const {clientarr} = this.state
    // console.log(name, clientarr)
    for (let i = 0; i < clientarr.length; i++){
      if(clientarr[i].id === name){
        clientarr[i].checked = e.target.checked;
        break;
      }
    }
    await this.setState({
      clientarr: [...clientarr]
    })
  }

  //add trade ID 
  handleChange2 = (e) => {
    e.persist();
    const { clients } = this.state;
    const { transactions } = this.state;

    if(e.target.name === "client_id"){
        this.setState({clientarr:[]})
        this.setState({tradeId: 0})
    }
    this.setState({[e.target.name]: e.target.value}, ()=>{
        // if (e.target.name === "client_id"){
            // let clients = [...this.state.clients];
            let client = {}
            for (let i =0; i<clients.length; i++){
                // clients[i].id is a Number while state.client_id is a String/ or can use ==
                if (clients[i].id === Number(this.state.client_id)) {
                    client.address = clients[i].address
                    client.client = clients[i].client
                    client.deduct_broker_comms = clients[i].deduct_broker_comms
                    client.duedate = clients[i].duedate
                    client.entity = clients[i].entity
                    client.id = clients[i].id
                    client.in_sg = clients[i].in_sg
                    client.invoice_emails = clients[i].invoice_emails;
                    break;
                }
            }
            this.setState({client}, ()=>{
              //find clients trades based on that month and year  
              let clientarr = []
              for (let i=0; i<transactions.length; i++){
                let transac = {}
                let dateMonth = new Date(transactions[i].trade_date).getMonth() + 1;
                let dateYear = new Date(transactions[i].trade_date).getFullYear();
                // console.log(transactions[i].b_clientid, this.state.client_id, this.getMon(this.state.fromM), dateMonth)
                if(transactions[i].b_clientid === Number(this.state.client_id) &&
                  this.getMon(this.state.fromM) === dateMonth &&
                  dateYear === parseInt(this.state.year)){
                    let size = transactions[i].volume;
                    // let size = transactions[j].qty;
                    // if (transactions[j].instrument === "S") {
                    //   size = transactions[j].qty * 500 * transactions[j].consmonth;
                    // } else {
                    //   size = transactions[j].qty * 100 * transactions[j].consmonth;
                    // }
                    let date = new Date(
                      transactions[i].trade_date
                    ).toLocaleDateString();
                    transac.id = transactions[i].trade_id;
                    transac.address = this.state.client.address;
                    transac.entity = this.state.client.entity;
                    transac.in_sg = this.state.client.in_sg;
                    transac.duedate = this.state.client.duedate;
                    transac.invoice_emails = this.state.client.invoice_emails;
                    transac.trade_date = date;
                    transac.client = this.state.client.client;
                    transac.product = transactions[i].product;
                    transac.instrument = transactions[i].instrument;
                    transac.bs = "Buy";
                    transac.account = transactions[i].b_account;
                    transac.idb = transactions[i].b_idb;
                    transac.trader = transactions[i].b_trader;
                    transac.comms = transactions[i].b_commission;
                    transac.tcomms =
                      Math.round(
                        parseFloat(transactions[i].b_tcomm) * 100
                      ) / 100;
                    transac.price = transactions[i].price;
                    transac.strike = transactions[i].strike;
                    transac.qty = transactions[i].qty;
                    transac.size = size;
                    transac.contract = transactions[i].contract;
                    transac.deal_id = transactions[i].deal_id;
                    transac.deduct_broker_comms = this.state.client.deduct_broker_comms;
                    transac.unit = transactions[i].unit;
                    transac.checked = true
                  }
                if(transactions[i].s_clientid === Number(this.state.client_id) &&
                  this.getMon(this.state.fromM) === dateMonth &&
                  dateYear === parseInt(this.state.year)){
                    let size = transactions[i].volume;
                    // let size = transactions[j].qty;
                    // if (transactions[j].instrument === "S") {
                    //   size = transactions[j].qty * 500 * transactions[j].consmonth;
                    // } else {
                    //   size = transactions[j].qty * 100 * transactions[j].consmonth;
                    // }
                    let date = new Date(
                      transactions[i].trade_date
                    ).toLocaleDateString();
                    transac.id = transactions[i].trade_id;
                    transac.address = this.state.client.address;
                    transac.entity = this.state.client.entity;
                    transac.in_sg = this.state.client.in_sg;
                    transac.duedate = this.state.client.duedate;
                    transac.invoice_emails = this.state.client.invoice_emails;
                    transac.trade_date = date;
                    transac.client = this.state.client.client;
                    transac.product = transactions[i].product;
                    transac.instrument = transactions[i].instrument;
                    transac.bs = "Sell";
                    transac.account = transactions[i].s_account;
                    transac.idb = transactions[i].s_idb;
                    transac.trader = transactions[i].s_trader;
                    transac.comms = transactions[i].s_commission;
                    transac.tcomms =
                      Math.round(
                        parseFloat(transactions[i].s_tcomm) * 100
                      ) / 100;
                    transac.price = transactions[i].price;
                    transac.strike = transactions[i].strike;
                    transac.qty = transactions[i].qty;
                    transac.size = size;
                    transac.contract = transactions[i].contract;
                    transac.deal_id = transactions[i].deal_id;
                    transac.deduct_broker_comms = this.state.client.deduct_broker_comms;
                    transac.unit = transactions[i].unit;
                    transac.checked = true
                  }
                  if (Object.keys(transac).length){
                    clientarr.push(transac)
                  }
              }
              // console.log(clientarr)
              this.setState({ clientarr });
            })
        // }
    })
  }

  addTrade = async (e) => {
    e.preventDefault();
    await fetch(`/api/transactions/${this.state.tradeId}`)
        .then((res) => res.json())
        .then((data) => {
            // console.log(data)
            let transac = {};
            if (Number(data.b_clientid) === Number(this.state.client.id)) {
                let size = data.volume;
                let date = new Date(
                    data.trade_date
                  ).toLocaleDateString();
                transac.id = data.id;
                transac.address = this.state.client.address;
                transac.entity = this.state.client.entity;
                transac.in_sg = this.state.client.in_sg;
                transac.duedate = this.state.client.duedate;
                transac.invoice_emails = this.state.client.invoice_emails;
                transac.trade_date = date;
                transac.client = this.state.client.client;
                transac.product = data.product;
                transac.instrument = data.instrument;
                transac.bs = "Buy";
                transac.account = data.b_account;
                transac.idb = data.b_idb;
                transac.trader = data.b_trader;
                transac.comms = data.b_commission;
                transac.tcomms =
                Math.round(
                  parseFloat(data.b_tcomm) * 100
                ) / 100;
                transac.price = data.price;
                transac.strike = data.strike;
                transac.qty = data.qty;
                transac.size = size;
                transac.contract = data.contract;
                transac.deal_id = data.deal_id;
                transac.deduct_broker_comms = this.state.client.deduct_broker_comms;
                transac.unit = data.unit;
                transac.checked = true
            }
            if (Number(data.s_clientid) === Number(this.state.client.id)) {
                let size = data.volume;
                let date = new Date(
                    data.trade_date
                  ).toLocaleDateString();
                transac.id = data.id;
                transac.address = this.state.client.address;
                transac.entity = this.state.client.entity;
                transac.in_sg = this.state.client.in_sg;
                transac.duedate = this.state.client.duedate;
                transac.invoice_emails = this.state.client.invoice_emails;
                transac.trade_date = date;
                transac.client = this.state.client.client;
                transac.product = data.product;
                transac.instrument = data.instrument;
                transac.bs = "Sell";
                transac.account = data.s_account;
                transac.idb = data.s_idb;
                transac.trader = data.s_trader;
                transac.comms = data.s_commission;
                transac.tcomms =
                Math.round(
                    parseFloat(data.s_tcomm) * 100
                ) / 100;
                transac.price = data.price;
                transac.strike = data.strike;
                transac.qty = data.qty;
                transac.size = size;
                transac.contract = data.contract;
                transac.deal_id = data.deal_id;
                transac.deduct_broker_comms = this.state.client.deduct_broker_comms;
                transac.unit = data.unit;
                transac.checked = true
            }
            // console.log(transac)
            this.setState({clientarr: [...this.state.clientarr, transac]},()=>{
                // console.log(this.state.clientarr)
            })
        })
  }

  createPdf = () => {
    let invoiceNo = 0;
    if (this.state.clientarr[0].entity === "HK") {
      invoiceNo = this.state.invoiceNoHK;
    } else if (this.state.clientarr[0].entity === "SG") {
      invoiceNo = this.state.invoiceNoSG;
    } else if (this.state.clientarr[0].entity === "UK") {
      invoiceNo = this.state.invoiceNoUK;
    } 

    //get unchecked trades to go into PDF only
    let selectedClientarr = [];
    const {clientarr} = this.state

    for (let i=0; i<clientarr.length; i++){
      if(clientarr[i].checked === true){
        selectedClientarr.push(clientarr[i])
      }
    }
    // console.log(selectedClientarr)

    let dataState = {
      client: [...selectedClientarr],
      exrate: this.state.exrate,
      invoiceNo: invoiceNo,
      fromM: this.state.fromM,
      year: this.state.year,
    };
    axios
      .post("/createCNpdf", dataState)
      .then(() => axios.get("/getpdf", { responseType: "blob" }))
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        saveAs(pdfBlob, `${invoiceNo}.pdf`);
        this.setState({ disabled: false });
      });
  };

  sendPdf = () => {
    let invoiceNo = 0;
    if (this.state.clientarr[0].entity === "HK") {
      invoiceNo = this.state.invoiceNoHK;
    } else if (this.state.clientarr[0].entity === "SG") {
      invoiceNo = this.state.invoiceNoSG;
    } else if (this.state.clientarr[0].entity === "UK") {
      invoiceNo = this.state.invoiceNoUK;
    }
    let data = {
      invoiceNo: invoiceNo,
      invoice_emails: this.state.clientarr[0].invoice_emails,
      client: this.state.clientarr[0].client,
      fromM: this.state.fromM,
      year: this.state.year,
    };
    if (
      window.confirm(
        `
        Please confirm to send ${data.client} Credit Note
        `
      )
    ) {
      fetch("/sendCNpdf", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(() => {
          console.log("Email successfully sent from <SEND PDF>");
          if (this.state.clientarr[0].entity === "HK") {
            this.setState((prevState) => ({
              invoiceNoHK: parseInt(prevState.invoiceNoHK) + 1,
            }));
          } else if (this.state.clientarr[0].entity === "SG") {
            this.setState((prevState) => ({
              invoiceNoSG: parseInt(prevState.invoiceNoSG) + 1,
            }));
          } else if (this.state.clientarr[0].entity === "UK") {
            this.setState((prevState) => ({
              invoiceNoUK: parseInt(prevState.invoiceNoUK) + 1,
            }));
          } else {
            console.log("submit function cannot find entity");
          }
        })
        .catch((error) => {
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
      // "Select",
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
      "Deal Id",
    ];

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
          onChange={this.handleChange2}
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
      <Fdashboard>
        <div className={classes.root}>
          {/* <FormControl component="fieldset" className={classes.formControl}>
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
            <FormHelperText>Select clients</FormHelperText>
          </FormControl> */}

          <div>
            <FormControl className={classes.textControl} variant="outlined">
                <InputLabel
                  ref={(ref) => {
                    this.InputLabelRef = ref;
                  }}
                >
                  Select Client
                </InputLabel>
                <Select
                  inputProps={{
                    classes: {
                      select: classes.resize,
                    },
                  }}
                  native
                  name="client_id"
                  value={this.state.client_id}
                  onChange={this.handleChange2}
                  input={
                    <OutlinedInput
                      name="client_id"
                      labelWidth={this.state.labelWidth}
                    />
                  }
                >
                  {clients.map((client, index) => (
                    <option key={index} value={client.id}>
                      {client.client}
                    </option>
                  ))}
                </Select>
              </FormControl>

            <FormControl className={classes.dateControl} variant="outlined">
              <InputLabel
                ref={(ref) => {
                  this.InputLabelRef = ref;
                }}
              >
                From Month
              </InputLabel>
              <Select
                native
                name="fromM"
                value={this.state.fromM}
                onChange={this.handleChange2}
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
            <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <TextField
              className={classes.textControl}
              label="SGD/USD"
              name="exrate"
              type="number"
              inputProps={{ step: 0.001, style: { width: 60 } }}
              value={this.state.exrate}
              onChange={this.handleChange2}
              variant="outlined"
            />
            <TextField
              className={classes.textControl}
              label="CN No. (SG)"
              name="invoiceNoSG"
              type="number"
              inputProps={{ style: { width: 75 } }}
              value={this.state.invoiceNoSG}
              onChange={this.handleChange2}
              variant="outlined"
            />
            <TextField
              className={classes.textControl}
              label="CN No. (HK)"
              name="invoiceNoHK"
              type="number"
              inputProps={{ style: { width: 75 } }}
              value={this.state.invoiceNoHK}
              onChange={this.handleChange2}
              variant="outlined"
            />
            <TextField
              className={classes.textControl}
              label="CN No. (UK)"
              name="invoiceNoUK"
              type="number"
              inputProps={{ style: { width: 75 } }}
              value={this.state.invoiceNoUK}
              onChange={this.handleChange2}
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
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <TextField
              className={classes.textControl}
              label="Trade ID"
              name="tradeId"
              type="number"
              inputProps={{ style: { width: 75, height: 2 } }}
              value={this.state.tradeId}
              onChange={this.handleChange2}
              variant="outlined"
                />
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <Button
                variant="contained"
                color="secondary"
                onClick={this.addTrade}
              >
                Add Trade
              </Button>
            </div>
            <br />
            <br />
            <Paper className={classes.root}>
              <Table>
                <TableHead>
                  <TableRow>
                    <CustomTableCell align="center" >
                      <Checkbox
                        checked={this.state.allCheck}
                        onChange={this.handleChange4}
                        value={0}
                      />
                    </CustomTableCell>
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
                        {/* <FormControlLabel
                          key={index}
                          control={
                            <Checkbox
                              checked={client.checked}
                              onChange={this.handleChange2}
                              value={client.id}
                            />
                          }
                          label={client.id}
                          /> */}
                        <CustomTableCell align="center">
                          <Checkbox
                            checked={client.checked}
                            onChange={this.handleChange3(client.id)}
                            value={client.id}
                          />
                        </CustomTableCell>
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
      </Fdashboard>
    );
  }
}

Creditnote.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  clientsObj: state.clients.clientsObj,
  loading: state.clients.loading,
  error: state.clients.error,
});

export default connect(mapStateToProps)(withStyles(styles)(Creditnote));
