import React, { Component } from "react";
import ReactDOM from "react-dom";
import { MyContext } from "../components/store/createContext";

import { withStyles } from "@material-ui/core/styles";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const styles = theme => ({
  formControl: {
    // margin: theme.spacing.unit,
    minWidth: 120
  },
  dateControl: {
    maxWidth: 120
  },
  textControl: {
    maxWidth: 120
  },
  resize: {
    fontSize: 13,
    lineHeight: 1
  },
  midbutton: {
    display: "flex",
    alignItems: "center"
  }
});

class Manualinput extends Component {
  state = {
    value: [], //full list clients in dictionary
    clients: [], //clients array
    b_client: [], //client select
    b_client_id: "",
    s_client: [], //client Sell select
    s_client_id: "",
    b_trader: [],
    s_trader: [],
    b_broker: "",
    s_broker: "",
    b_accounts: [],
    s_accounts: [],
    s_comms: 0.0,
    b_comms: 0.0,
    s_idb: "",
    b_idb: "",
    s_recap: "",
    b_recap: "",
    productsObj: [],
    instruObj: [],
    instrument: "F",
    product_code: "FEF",
    products: "Iron ore TSI62 Futures",
    fromM: "May",
    toM: "May",
    year: "2019",
    price: "",
    strike: "",
    qty: 50,
    execTime: "",
    execDate: "",
    dealGroup: 1,
    arrayCsv: [],
    created_byid: ""
  };

  componentDidMount() {
    let created_byid = parseInt(localStorage.getItem("user_id"));
    this.setState({
      created_byid: created_byid,
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
      toM: this.revMon(new Date().getMonth()),
      fromM: this.revMon(new Date().getMonth()),
      year: new Date().getFullYear(),

      arrayCsv: [
        [
          "Group No.",
          "Trade type",
          "Leg Group",
          "Exec Date",
          "Exec Time",
          "Product",
          "Month/Year",
          "Instrument Type",
          "Off-exchange Type",
          "Strike Px",
          "Cons Months",
          "B/S",
          "Qty",
          "Price",
          "Party1 IDB",
          "Party1 GCM",
          "Party1 A/C",
          "Party1 Comment",
          "Party2 IDB",
          "Party2 GCM",
          "Party2 A/C",
          "Party2 Comment"
        ]
      ]
    });
    let date = new Date();
    let month;
    let day;
    if (date.getMonth() + 1 < 10) {
      month = "0" + (date.getMonth() + 1);
    } else {
      month = date.getMonth() + 1;
    }
    if (date.getDate() < 10) {
      day = "0" + date.getDate();
    } else {
      day = date.getDate();
    }
    let exec_date = date.getFullYear() + "-" + month + "-" + day;
    this.setState({ execDate: exec_date });
    const options = { hour12: false };
    this.setState({
      execTime: date.toLocaleTimeString("en-US", options).substring(0, 5)
    });
    try {
      fetch("/api/clients", {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token")
        }
      })
        .then(res => res.json())
        .then(data => {
          let clients = [" "];
          let clientsObj = [];
          for (let i = 0; i < data.length; i++) {
            clients.push(data[i].client_name);
          }
          clients = [...new Set(clients)];
          for (let i = 0; i < clients.length; i++) {
            let address = "";
            let traders = [];
            let accounts = [];
            let recap_emails = "";
            let invoice_emails = "";
            let commission = 0;
            let idb = "";
            let id = "";
            let entity = "";
            let in_sg = 0;

            for (let j = 0; j < data.length; j++) {
              if (data[j].client_name === clients[i]) {
                address = data[j].address;
                id = data[j].id;
                traders.push(data[j].trader_name);
                accounts.push(data[j].account);
                recap_emails = data[j].recap_emails;
                invoice_emails = data[j].invoice_emails;
                commission = data[j].commission;
                idb = data[j].idb;
                entity = data[j].entity;
                in_sg = data[j].in_sg;
              }
            }
            clientsObj.push({
              clients: clients[i],
              address: address,
              accounts: [...new Set(accounts)],
              traders: [...new Set(traders)],
              commission: commission,
              recap_emails: recap_emails,
              invoice_emails: invoice_emails,
              idb: idb,
              id: id,
              entity: entity,
              in_sg: in_sg
            });
          }
          this.setState({ value: clientsObj });
          this.setState({ clients });
          this.context.setClients(clientsObj);
        });
      fetch("/api/products")
        .then(res => res.json())
        .then(data => {
          this.setState({ productsObj: data });
        });
      fetch("/api/instruments")
        .then(res => res.json())
        .then(data => {
          this.setState({ instruObj: data });
        });
    } catch (e) {
      console.log(e, "error getting clients due to permissions");
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
    // console.log("Fired");
  };

  handleChangeB = x => e => {
    this.setState({ [x]: e.target.value });
    let client = e.target.value;
    for (let i = 0; i < this.state.value.length; i++) {
      if (this.state.value[i].clients === client) {
        this.setState({
          b_client_id: this.state.value[i].id,
          b_trader: this.state.value[i].traders[0],
          b_accounts: this.state.value[i].accounts[0],
          b_comms: this.state.value[i].commission,
          b_recap: this.state.value[i].recap_emails,
          b_idb: this.state.value[i].idb
        });
      }
    }
  };

  handleChangeS = x => e => {
    this.setState({ [x]: e.target.value });
    let client = e.target.value;
    for (let i = 0; i < this.state.value.length; i++) {
      if (this.state.value[i].clients === client) {
        this.setState({
          s_trader: this.state.value[i].traders[0],
          s_client_id: this.state.value[i].id,
          s_accounts: this.state.value[i].accounts[0],
          s_comms: this.state.value[i].commission,
          s_recap: this.state.value[i].recap_emails,
          s_idb: this.state.value[i].idb
        });
      }
    }
  };

  loopFunc(x, y) {
    for (let i = 0; i < this.state.value.length; i++) {
      if (this.state.b_client === this.state.value[i].clients) {
        for (let j = 0; j < this.state.value[i][x].length; j++) {
          if (j === 0) {
            y.push(
              <option defaultValue key={j} value={this.state.value[i][x][j]}>
                {this.state.value[i][x][j]}
              </option>
            );
          } else {
            y.push(
              <option key={j} value={this.state.value[i][x][j]}>
                {this.state.value[i][x][j]}
              </option>
            );
          }
        }
      }
    }
  }

  sloopFunc(x, y) {
    for (let i = 0; i < this.state.value.length; i++) {
      if (this.state.s_client === this.state.value[i].clients) {
        for (let j = 0; j < this.state.value[i][x].length; j++) {
          if (j === 0) {
            y.push(
              <option defaultValue key={j} value={this.state.value[i][x][j]}>
                {this.state.value[i][x][j]}
              </option>
            );
          } else {
            y.push(
              <option key={j} value={this.state.value[i][x][j]}>
                {this.state.value[i][x][j]}
              </option>
            );
          }
        }
      }
    }
  }
  //get month in number
  getMon = month => {
    return "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(month) / 3 + 1;
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

  allege = entity => {
    // this.setState({
    //   b_client: "",
    //   b_trader: "",
    //   b_accounts: ""
    // });

    // if (entity === "SG") {
    //   this.setState({ b_idb: "S674" });
    // } else if (entity === "HK") {
    //   this.setState({ b_idb: "S664" });
    // }
    if (this.state.b_idb === "S664" && entity === "HK") {
      this.setState({
        b_client: "",
        b_trader: "",
        b_accounts: ""
      });
    }
    if (this.state.s_idb === "S664" && entity === "HK") {
      this.setState({
        s_client: "",
        s_trader: "",
        s_accounts: ""
      });
    }
    if (this.state.b_idb === "S674" && entity === "SG") {
      this.setState({
        b_client: "",
        b_trader: "",
        b_accounts: ""
      });
    }
    if (this.state.s_idb === "S674" && entity === "SG") {
      this.setState({
        s_client: "",
        s_trader: "",
        s_accounts: ""
      });
    }
  };

  flip = () => {
    let b_client = this.state.b_client;
    let b_trader = this.state.b_trader;
    let b_accounts = this.state.b_accounts;
    let b_comms = this.state.b_comms;
    let s_client = this.state.s_client;
    let s_trader = this.state.s_trader;
    let s_accounts = this.state.s_accounts;
    let s_comms = this.state.s_comms;
    let s_broker = this.state.s_broker;
    let b_broker = this.state.b_broker;
    let s_idb = this.state.s_idb;
    let b_idb = this.state.b_idb;
    let b_client_id = this.state.b_client_id;
    let s_client_id = this.state.s_client_id;
    let b_recap = this.state.b_recap;
    let s_recap = this.state.s_recap;

    this.setState({
      b_client: s_client,
      b_trader: s_trader,
      b_accounts: s_accounts,
      b_comms: s_comms,
      s_client: b_client,
      s_trader: b_trader,
      s_accounts: b_accounts,
      s_comms: b_comms,
      s_broker: b_broker,
      b_broker: s_broker,
      s_idb: b_idb,
      b_idb: s_idb,
      s_client_id: b_client_id,
      b_client_id: s_client_id,
      b_recap: s_recap,
      s_recap: b_recap
    });
  };

  clear = () => {
    this.setState({
      b_client: "",
      b_trader: "",
      b_accounts: "",
      b_comms: 0,
      s_client: "",
      s_trader: "",
      s_accounts: "",
      s_comms: 0,
      s_broker: "",
      b_broker: "",
      strike: "",
      qty: 50,
      price: "",
      fromM: this.revMon(new Date().getMonth()),
      toM: this.revMon(new Date().getMonth()),
      year: new Date().getFullYear()
    });
  };

  handleQ1 = () => {
    this.setState({ fromM: "Jan" });
    this.setState({ toM: "Mar" });
  };
  handleQ2 = () => {
    this.setState({ fromM: "Apr" });
    this.setState({ toM: "Jun" });
  };
  handleQ3 = () => {
    this.setState({ fromM: "Jul" });
    this.setState({ toM: "Sep" });
  };
  handleQ4 = () => {
    this.setState({ fromM: "Oct" });
    this.setState({ toM: "Dec" });
  };

  spreadComms = dir => {
    if (dir === "buyer") {
      this.setState({ b_comms: this.state.b_comms / 2 });
    } else if (dir === "seller") {
      this.setState({ s_comms: this.state.s_comms / 2 });
    }
  };

  handleSubmit = e => {
    e.preventDefault();

    let toM = this.getMon(this.state.toM);
    let fromM = this.getMon(this.state.fromM);
    let consMonth = toM - fromM + 1;
    // console.log(fromM, toM, consMonth, "checking to and from");
    let contract = "";
    if (fromM === 1 && consMonth === 3) {
      contract = "Q1'" + this.state.year;
    } else if (fromM === 4 && consMonth === 3) {
      contract = "Q2'" + this.state.year;
    } else if (fromM === 7 && consMonth === 3) {
      contract = "Q3'" + this.state.year;
    } else if (fromM === 10 && consMonth === 3) {
      contract = "Q4'" + this.state.year;
    } else {
      contract = this.state.fromM + "'" + this.state.year;
    }

    if (
      window.confirm(
        `Please check the below info:
        
        Buyer: ${this.state.b_client}
        Buyer_IDB: ${this.state.b_idb}
        Buyer_account: ${this.state.b_accounts} 
        Buyer_trader: ${this.state.b_trader}
        Buyer_comms: ${this.state.b_comms}

        Seller: ${this.state.s_client}
        Seller_IDB: ${this.state.s_idb}
        Seller_account: ${this.state.s_accounts} 
        Seller_trader: ${this.state.s_trader}
        Seller_comms: ${this.state.s_comms}
        
        Product: ${this.state.product_code}
        Instrument: ${this.state.instrument}
        Contract: ${contract}
        Price: ${this.state.price}
        Strike: ${this.state.strike}
        Quantity: ${this.state.qty}`
      )
    ) {
      const dataState = {
        ...this.state,
        consMonth: consMonth,
        contract: contract
      };
      // post to transaction
      fetch("/api/transactions", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataState)
      })
        .then(res => res.json())
        .then(data => {
          console.log("this is a success on transactions!!");
        });
    }
  };

  render() {
    const { classes } = this.props;
    let b_traders = [];
    let b_accounts = [];
    let s_traders = [];
    let s_accounts = [];

    this.loopFunc("traders", b_traders);
    this.loopFunc("accounts", b_accounts);
    this.sloopFunc("traders", s_traders);
    this.sloopFunc("accounts", s_accounts);

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
          inputProps={{
            classes: {
              select: classes.resize
            }
          }}
          name="year"
          value={this.state.year}
          onChange={this.handleChange}
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
      <div>
        <form onSubmit={this.handleSubmit}>
          <div className={classes.midbutton}>
            <TextField
              className={classes.textControl}
              label="Deal Group"
              name="dealGroup"
              type="number"
              inputProps={{ step: 1, style: { fontSize: 13, lineHeight: 1 } }}
              value={this.state.dealGroup}
              onChange={this.handleChange}
              variant="outlined"
            />
            <TextField
              label="Trade date"
              name="execDate"
              type="date"
              inputProps={{
                style: { fontSize: 13, lineHeight: 1 }
              }}
              value={this.state.execDate}
              onChange={this.handleChange}
              variant="outlined"
            />
            <TextField
              label="Trade Time"
              name="execTime"
              type="time"
              inputProps={{
                style: { fontSize: 13, lineHeight: 1 }
              }}
              value={this.state.execTime}
              onChange={this.handleChange}
              variant="outlined"
            />
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <TextField
              className={classes.textControl}
              label="Buy Broker"
              name="b_broker"
              value={this.state.b_broker}
              onChange={this.handleChange}
              inputProps={{
                style: { fontSize: 13, lineHeight: 1 }
              }}
              variant="outlined"
            />
            <TextField
              className={classes.textControl}
              label="Sell Broker"
              name="s_broker"
              value={this.state.s_broker}
              onChange={this.handleChange}
              inputProps={{
                style: { fontSize: 13, lineHeight: 1 }
              }}
              variant="outlined"
            />
          </div>
          <br />
          <div className={classes.midbutton}>
            <FormControl className={classes.formControl} variant="outlined">
              <InputLabel
                ref={ref => {
                  this.InputLabelRef = ref;
                }}
              >
                Product
              </InputLabel>
              <Select
                inputProps={{
                  classes: {
                    select: classes.resize
                  }
                }}
                native
                name="product_code"
                value={this.state.product_code}
                onChange={this.handleChange}
                input={
                  <OutlinedInput
                    name="product_code"
                    labelWidth={this.state.labelWidth}
                  />
                }
              >
                {this.state.productsObj.map((code, index) => (
                  <option key={index} value={code.code}>
                    {code.code}&nbsp;&nbsp;&nbsp;{code.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl className={classes.formControl} variant="outlined">
              <InputLabel
                ref={ref => {
                  this.InputLabelRef = ref;
                }}
              >
                Instrument
              </InputLabel>
              <Select
                native
                name="instrument"
                value={this.state.instrument}
                onChange={this.handleChange}
                input={
                  <OutlinedInput
                    name="instrument"
                    labelWidth={this.state.labelWidth}
                  />
                }
                inputProps={{
                  classes: {
                    select: classes.resize
                  }
                }}
              >
                {this.state.instruObj.map((code, index) => (
                  <option key={index} value={code.code}>
                    {code.code} - {code.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </div>
          <br />
          <div className={classes.midbutton}>
            <FormControl className={classes.formControl} variant="outlined">
              <InputLabel
                ref={ref => {
                  this.InputLabelRef = ref;
                }}
              >
                Buyer
              </InputLabel>
              <Select
                inputProps={{
                  classes: {
                    select: classes.resize
                  }
                }}
                native
                value={this.state.b_client}
                onChange={this.handleChangeB("b_client")}
                input={
                  <OutlinedInput
                    name="b_client"
                    labelWidth={this.state.labelWidth}
                  />
                }
              >
                {this.state.clients.map((client, index) => (
                  <option key={index} value={client}>
                    {client}
                  </option>
                ))}
              </Select>
            </FormControl>
          </div>
          <br />
          <div className={classes.midbutton}>
            <TextField
              className={classes.textControl}
              label="IDB"
              name="b_idb"
              value={this.state.b_idb}
              onChange={this.handleChange}
              inputProps={{
                style: { fontSize: 13, lineHeight: 1 }
              }}
              variant="outlined"
            />
          </div>
          <br />
          <div className={classes.midbutton}>
            <FormControl className={classes.formControl} variant="outlined">
              <InputLabel
                ref={ref => {
                  this.InputLabelRef = ref;
                }}
              >
                Trader
              </InputLabel>
              <Select
                inputProps={{
                  classes: {
                    select: classes.resize
                  }
                }}
                native
                name="b_trader"
                value={this.state.b_trader}
                onChange={this.handleChange}
                input={
                  <OutlinedInput
                    name="b_trader"
                    labelWidth={this.state.labelWidth}
                  />
                }
              >
                {b_traders.map(trader => trader)}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl} variant="outlined">
              <InputLabel
                ref={ref => {
                  this.InputLabelRef = ref;
                }}
              >
                Accounts
              </InputLabel>
              <Select
                inputProps={{
                  classes: {
                    select: classes.resize
                  }
                }}
                native
                name="b_accounts"
                value={this.state.b_accounts}
                onChange={this.handleChange}
                input={
                  <OutlinedInput
                    name="b_accounts"
                    labelWidth={this.state.labelWidth}
                  />
                }
              >
                {b_accounts.map(account => account)}
              </Select>
            </FormControl>
            <TextField
              className={classes.textControl}
              label="Commission"
              name="b_comms"
              type="number"
              inputProps={{
                step: 0.01,
                style: { fontSize: 13, lineHeight: 1 }
              }}
              value={this.state.b_comms}
              onChange={this.handleChange}
              variant="outlined"
            />
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                this.spreadComms("buyer");
              }}
            >
              S
            </Button>
          </div>
          <br />
          <div className={classes.midbutton}>
            <FormControl className={classes.dateControl} variant="outlined">
              <InputLabel
                ref={ref => {
                  this.InputLabelRef = ref;
                }}
              >
                From Month
              </InputLabel>
              <Select
                inputProps={{
                  classes: {
                    select: classes.resize
                  }
                }}
                native
                name="fromM"
                value={this.state.fromM}
                onChange={this.handleChange}
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
                <option defaultValue value="May">
                  May
                </option>
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
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
            <FormControl className={classes.dateControl} variant="outlined">
              <InputLabel
                ref={ref => {
                  this.InputLabelRef = ref;
                }}
              >
                To Month
              </InputLabel>
              <Select
                inputProps={{
                  classes: {
                    select: classes.resize
                  }
                }}
                native
                name="toM"
                value={this.state.toM}
                onChange={this.handleChange}
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
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <Button variant="contained" color="default" onClick={this.handleQ1}>
              Q1
            </Button>
            <span>&nbsp;&nbsp;</span>
            <Button variant="contained" color="default" onClick={this.handleQ2}>
              Q2
            </Button>
            <span>&nbsp;&nbsp;</span>
            <Button variant="contained" color="default" onClick={this.handleQ3}>
              Q3
            </Button>
            <span>&nbsp;&nbsp;</span>
            <Button variant="contained" color="default" onClick={this.handleQ4}>
              Q4
            </Button>
          </div>
          <br />
          <div className={classes.midbutton}>
            <FormControl className={classes.formControl} variant="outlined">
              <InputLabel
                ref={ref => {
                  this.InputLabelRef = ref;
                }}
              >
                Seller
              </InputLabel>
              <Select
                inputProps={{
                  classes: {
                    select: classes.resize
                  }
                }}
                native
                value={this.state.s_client}
                onChange={this.handleChangeS("s_client")}
                input={
                  <OutlinedInput
                    name="s_client"
                    labelWidth={this.state.labelWidth}
                  />
                }
              >
                {this.state.clients.map((client, index) => (
                  <option key={index} value={client}>
                    {client}
                  </option>
                ))}
              </Select>
            </FormControl>
          </div>
          <br />
          <div className={classes.midbutton}>
            <TextField
              className={classes.textControl}
              label="IDB"
              name="s_idb"
              value={this.state.s_idb}
              onChange={this.handleChange}
              inputProps={{
                style: { fontSize: 13, lineHeight: 1 }
              }}
              variant="outlined"
            />
          </div>
          <br />
          <div className={classes.midbutton}>
            <FormControl className={classes.formControl} variant="outlined">
              <InputLabel
                ref={ref => {
                  this.InputLabelRef = ref;
                }}
              >
                Trader
              </InputLabel>
              <Select
                inputProps={{
                  classes: {
                    select: classes.resize
                  }
                }}
                native
                name="s_trader"
                value={this.state.s_trader}
                onChange={this.handleChange}
                input={
                  <OutlinedInput
                    name="s_trader"
                    labelWidth={this.state.labelWidth}
                  />
                }
              >
                {s_traders.map(trader => trader)}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl} variant="outlined">
              <InputLabel
                ref={ref => {
                  this.InputLabelRef = ref;
                }}
              >
                Accounts
              </InputLabel>
              <Select
                inputProps={{
                  classes: {
                    select: classes.resize
                  }
                }}
                native
                name="s_accounts"
                value={this.state.s_accounts}
                onChange={this.handleChange}
                input={
                  <OutlinedInput
                    name="s_accounts"
                    labelWidth={this.state.labelWidth}
                  />
                }
              >
                {s_accounts.map(account => account)}
              </Select>
            </FormControl>
            <TextField
              className={classes.textControl}
              label="Commission"
              name="s_comms"
              type="number"
              inputProps={{
                step: 0.01,
                style: { fontSize: 13, lineHeight: 1 }
              }}
              value={this.state.s_comms}
              onChange={this.handleChange}
              variant="outlined"
            />
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                this.spreadComms("seller");
              }}
            >
              S
            </Button>
          </div>
          <br />
          <div className={classes.midbutton}>
            <TextField
              className={classes.textControl}
              label="Price"
              name="price"
              type="number"
              inputProps={{
                step: 0.05,
                style: { fontSize: 13, lineHeight: 1 }
              }}
              value={this.state.price}
              onChange={this.handleChange}
              variant="outlined"
            />
            <TextField
              className={classes.textControl}
              label="Quantity"
              name="qty"
              type="number"
              inputProps={{ step: 50, style: { fontSize: 13, lineHeight: 1 } }}
              value={this.state.qty}
              onChange={this.handleChange}
              variant="outlined"
            />
            <TextField
              className={classes.textControl}
              label="Strike"
              name="strike"
              type="number"
              inputProps={{
                step: 0.05,
                style: { fontSize: 13, lineHeight: 1 }
              }}
              value={this.state.strike}
              onChange={this.handleChange}
              variant="outlined"
            />
            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <Button onClick={() => this.allege("HK")} variant="contained">
              Allege HK
            </Button>
            <span>&nbsp;&nbsp;</span>
            <Button onClick={() => this.allege("SG")} variant="contained">
              Allege SG
            </Button>
          </div>
          <br />
          <div className={classes.midbutton}>
            <Button type="submit" variant="contained" color="primary">
              Input database
            </Button>
          </div>
        </form>
        <br />
        <div className={classes.midbutton}>
          <Button onClick={this.flip} variant="contained" color="default">
            Flip
          </Button>
          <span>&nbsp;&nbsp;&nbsp;</span>
          <Button onClick={this.clear} variant="contained" color="default">
            Clear
          </Button>
        </div>
        <br />
        <br />
      </div>
    );
  }
}

Manualinput.contextType = MyContext;

export default withStyles(styles)(Manualinput);