import React, { Component } from "react";
import ReactDOM from "react-dom";
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

class Client extends Component {
  state = {
    clients: [],
    clientarr: [],
    fromM: "",
    toM: "",
    year: 2020,
    exrate: 0.72,
    invoiceNo: 0,
    invoiceNoSG: 0,
    invoiceNoHK: 0,
    disabled: true,
    transactions: [],
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

  handleChange = (name) => async (event) => {
    const { transactions } = this.state;

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
    });

    let rangearr = this.range(
      this.getMon(this.state.fromM),
      this.getMon(this.state.toM)
    );
    let clientarr = [];

    // set a new array for clientarr to go into pdf
    for (let i = 0; i < this.state.clients.length; i++) {
      if (this.state.clients[i].checked === true) {
        // clientarr = [] if u want only 1 client to show
        // clientarr = [];
        for (let j = 0; j < transactions.length; j++) {
          let transac = {};
          let dateMonth = new Date(transactions[j].trade_date).getMonth() + 1;
          let dateYear = new Date(transactions[j].trade_date).getFullYear();
          if (
            transactions[j].b_clientid === clients[i].id &&
            rangearr.includes(dateMonth) &&
            dateYear === parseInt(this.state.year)
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
            rangearr.includes(dateMonth) &&
            dateYear === parseInt(this.state.year)
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
    await this.setState({ clientarr });
  };

  submit = async () => {
    const { clients } = this.state;
    const { transactions } = this.state;

    let rangearr = this.range(
      this.getMon(this.state.fromM),
      this.getMon(this.state.toM)
    );

    if (
      window.confirm(
        `
        Please confirm that you want to send all invoice
        `
      )
    ) {
      let clientarr = [];
      // set a new array for clientarr to go into pdf
      for (let i = 0; i < this.state.clients.length; i++) {
        if (this.state.clients[i].checked === true) {
          clientarr = [];
          for (let j = 0; j < transactions.length; j++) {
            let transac = {};
            let dateMonth = new Date(transactions[j].trade_date).getMonth() + 1;
            let dateYear = new Date(transactions[j].trade_date).getFullYear();
            if (
              transactions[j].b_clientid === clients[i].id &&
              rangearr.includes(dateMonth) &&
              dateYear === parseInt(this.state.year)
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
              rangearr.includes(dateMonth) &&
              dateYear === parseInt(this.state.year)
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

          let invoiceNo = 0;
          if (clientarr[0].entity === "HK") {
            invoiceNo = this.state.invoiceNoHK;
          } else if (clientarr[0].entity === "SG") {
            invoiceNo = this.state.invoiceNoSG;
          }
          //finish pushing all the transaction of 1 client
          let dataState = {
            client: [...clientarr],
            exrate: this.state.exrate,
            invoiceNo: invoiceNo,
            fromM: this.state.fromM,
            toM: this.state.toM,
            year: this.state.year,
          };

          await axios
            .post("/createpdf", dataState)
            .then(() => axios.get("/getpdf", { responseType: "blob" }))
            .then((res) => {
              const pdfBlob = new Blob([res.data], {
                type: "application/pdf",
              });
              saveAs(pdfBlob, `${invoiceNo}.pdf`);
            });
          let data = {
            invoiceNo: invoiceNo,
            invoice_emails: clientarr[0].invoice_emails,
            client: clientarr[0].client,
            toM: this.state.toM,
            year: this.state.year,
          };

          await fetch("/sendpdf", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
            .then(() => {
              if (clientarr[0].entity === "HK") {
                this.setState((prevState) => ({
                  invoiceNoHK: parseInt(prevState.invoiceNoHK) + 1,
                }));
              } else if (clientarr[0].entity === "SG") {
                this.setState((prevState) => ({
                  invoiceNoSG: parseInt(prevState.invoiceNoSG) + 1,
                }));
              } else {
                console.log("submit function cannot find entity");
              }
              //   this.setState((prevState) => ({
              //     invoiceNo: parseInt(prevState.invoiceNo) + 1,
              //   }));
            })
            .catch((error) => {
              console.error("error: ", error);
              alert("Error in sending email, please try again");
            });
          //   console.log(i, "next if");
        }
      }
    }
  };

  submitAll = async () => {
    const { clients } = this.state;
    const { transactions } = this.state;

    let rangearr = this.range(
      this.getMon(this.state.fromM),
      this.getMon(this.state.toM)
    );

    if (
      window.confirm(
        `
        Please confirm that you want to send all invoice
        `
      )
    ) {
      let clientarr = [];
      let total = 0;
      // set a new array for clientarr to go into pdf
      console.log(this.state.clients);
      for (let i = 0; i < this.state.clients.length; i++) {
        clientarr = [];
        total = 0;
        for (let j = 0; j < transactions.length; j++) {
          let transac = {};
          let dateMonth = new Date(transactions[j].trade_date).getMonth() + 1;
          let dateYear = new Date(transactions[j].trade_date).getFullYear();
          if (
            transactions[j].b_clientid === clients[i].id &&
            rangearr.includes(dateMonth) &&
            dateYear === parseInt(this.state.year)
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
            rangearr.includes(dateMonth) &&
            dateYear === parseInt(this.state.year)
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

        for (let n = 0; n < clientarr.length; n++) {
          total += clientarr[n].tcomms;
        }
        if (clientarr.length > 0 && total !== 0) {
          console.log(total, this.state.clients[i].client);

          let invoiceNo = 0;
          if (clientarr[0].entity === "HK") {
            invoiceNo = this.state.invoiceNoHK;
          } else if (clientarr[0].entity === "SG") {
            invoiceNo = this.state.invoiceNoSG;
          }
          //finish pushing all the transaction of 1 client
          let dataState = {
            client: [...clientarr],
            exrate: this.state.exrate,
            invoiceNo: invoiceNo,
            fromM: this.state.fromM,
            toM: this.state.toM,
            year: this.state.year,
          };

          await axios
            .post("/createpdf", dataState)
            .then(() => axios.get("/getpdf", { responseType: "blob" }))
            .then((res) => {
              const pdfBlob = new Blob([res.data], {
                type: "application/pdf",
              });
              saveAs(pdfBlob, `${invoiceNo}.pdf`);
            });
          let data = {
            invoiceNo: invoiceNo,
            invoice_emails: clientarr[0].invoice_emails,
            client: clientarr[0].client,
            toM: this.state.toM,
            year: this.state.year,
          };

          await fetch("/sendpdf", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
            .then(() => {
              if (clientarr[0].entity === "HK") {
                this.setState((prevState) => ({
                  invoiceNoHK: parseInt(prevState.invoiceNoHK) + 1,
                }));
              } else if (clientarr[0].entity === "SG") {
                this.setState((prevState) => ({
                  invoiceNoSG: parseInt(prevState.invoiceNoSG) + 1,
                }));
              } else {
                console.log("submit function cannot find entity");
              }
              //   this.setState((prevState) => ({
              //     invoiceNo: parseInt(prevState.invoiceNo) + 1,
              //   }));
            })
            .catch((error) => {
              console.error("error: ", error);
              alert("Error in sending email, please try again");
            });
        } else {
          console.log(`no invoice for ${this.state.clients[i].client}`);
        }

        //   console.log(i, "next if");
      }
    }
  };

  handleChange1 = (e) => {
    // to prevent e.target.name to go back to null
    e.persist();
    const { clients } = this.state;
    const { transactions } = this.state;

    this.setState({ [e.target.name]: e.target.value }, () => {
      if (e.target.name === "toM" || e.target.name === "fromM") {
        let rangearr = this.range(
          this.getMon(this.state.fromM),
          this.getMon(this.state.toM)
        );
        let clientarr = [];

        // set a new array for clientarr to go into pdf
        for (let i = 0; i < this.state.clients.length; i++) {
          if (this.state.clients[i].checked === true) {
            // clientarr = [] if u want only 1 client to show
            // clientarr = [];
            for (let j = 0; j < transactions.length; j++) {
              let transac = {};
              let dateMonth =
                new Date(transactions[j].trade_date).getMonth() + 1;
              let dateYear = new Date(transactions[j].trade_date).getFullYear();
              if (
                transactions[j].b_clientid === clients[i].id &&
                rangearr.includes(dateMonth) &&
                dateYear === parseInt(this.state.year)
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
                transac.tcomms =
                  parseFloat(transactions[j].b_commission) * size;
                transac.price = transactions[j].price;
                transac.strike = transactions[j].strike;
                transac.qty = transactions[j].qty;
                transac.size = size;
                transac.contract = transactions[j].contract;
                transac.deal_id = transactions[j].deal_id;
              }
              if (
                transactions[j].s_clientid === clients[i].id &&
                rangearr.includes(dateMonth) &&
                dateYear === parseInt(this.state.year)
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
                transac.tcomms =
                  parseFloat(transactions[j].s_commission) * size;
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
      }
    });
  };

  createPdf = () => {
    let invoiceNo = 0;
    if (this.state.clientarr[0].entity === "HK") {
      invoiceNo = this.state.invoiceNoHK;
    } else if (this.state.clientarr[0].entity === "SG") {
      invoiceNo = this.state.invoiceNoSG;
    }
    let dataState = {
      client: [...this.state.clientarr],
      exrate: this.state.exrate,
      invoiceNo: invoiceNo,
      fromM: this.state.fromM,
      toM: this.state.toM,
      year: this.state.year,
    };
    axios
      .post("/createpdf", dataState)
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
    }
    let data = {
      invoiceNo: invoiceNo,
      invoice_emails: this.state.clientarr[0].invoice_emails,
      client: this.state.clientarr[0].client,
      toM: this.state.toM,
      year: this.state.year,
    };
    if (
      window.confirm(
        `
        Please confirm to send ${data.client} invoice
        `
      )
    ) {
      fetch("/sendpdf", {
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
          onChange={this.handleChange1}
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
            <FormHelperText>Select clients</FormHelperText>
          </FormControl>

          <div>
            <br />
            <br />
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
                ref={(ref) => {
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
                  <OutlinedInput
                    name="toM"
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
              onChange={this.handleChange1}
              variant="outlined"
            />
            <TextField
              className={classes.textControl}
              label="Invoice No. (SG)"
              name="invoiceNoSG"
              type="number"
              inputProps={{ style: { width: 75 } }}
              value={this.state.invoiceNoSG}
              onChange={this.handleChange1}
              variant="outlined"
            />
            <TextField
              className={classes.textControl}
              label="Invoice No. (HK)"
              name="invoiceNoHK"
              type="number"
              inputProps={{ style: { width: 75 } }}
              value={this.state.invoiceNoHK}
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
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <Button variant="contained" color="primary" onClick={this.submit}>
                Send Multiple
              </Button>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <Button
                variant="contained"
                color="secondary"
                onClick={this.submitAll}
              >
                Send All
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
      </Fdashboard>
    );
  }
}

Client.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  clientsObj: state.clients.clientsObj,
  loading: state.clients.loading,
  error: state.clients.error,
});

export default connect(mapStateToProps)(withStyles(styles)(Client));
