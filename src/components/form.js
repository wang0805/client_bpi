import React, { Component } from "react";
import ReactDOM from "react-dom";

import { withStyles } from "@material-ui/core/styles";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import Fdashboard from "./dashboard/fdashboard";

import { connect } from "react-redux";
import { fetchClients, fetchProducts } from "../components/store/actions";

const styles = (theme) => ({
  formControl: {
    minWidth: 120,
  },
  dateControl: {
    maxWidth: 120,
  },
  textControl: {
    maxWidth: 120,
  },
  resize: {
    fontSize: 13,
    lineHeight: 1,
  },
  midbutton: {
    display: "flex",
    alignItems: "center",
  },
});

class Form extends Component {
  state = {
    //value: [], full list clients in dictionary
    // clients: [], clients array
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
    s_comms: "",
    b_comms: "",
    s_idb: "",
    b_idb: "",
    s_recap: "",
    b_recap: "",
    productsObj: [],
    instruObj: [],
    instrument: "F",
    product_code: "FEF",
    products: "Iron ore TSI62 Futures",
    fromM: "Jan",
    toM: "Jan",
    year: "2020",
    price: "",
    strike: "",
    qty: 50,
    execTime: "",
    execDate: "",
    dealGroup: 1,
    arrayCsv: [],
    created_byid: "",
    deal_id: null,
    brokers: [],
    contract_size: 100,
  };

  componentDidMount() {
    this.props.dispatch(fetchClients());
    this.props.dispatch(fetchProducts());

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
          "Party2 Comment",
        ],
      ],
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
      execTime: date.toLocaleTimeString("en-US", options).substring(0, 5),
    });
    try {
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          this.setState({ productsObj: data });
        });
      fetch("/api/instruments")
        .then((res) => res.json())
        .then((data) => {
          this.setState({ instruObj: data });
        });
      fetch("/api/users")
        .then((res) => res.json())
        .then((data) => {
          this.setState({ brokers: data }, () => {});
        });
    } catch (e) {
      console.log(e, "error getting clients due to permissions");
    }
  }

  handleChange = (e) => {
    e.persist();
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (e.target.name === "product_code") {
        for (let i = 0; i < this.props.productsObj.length; i++) {
          if (this.props.productsObj[i].code === e.target.value) {
            this.setState(
              { contract_size: this.props.productsObj[i].consize },
              () => {
                // console.log(this.state.contract_size);
              }
            );
          }
        }
      }
    });
  };

  handleChangeB = (x) => (e) => {
    this.setState({ [x]: e.target.value });
    let client = e.target.value;
    let product_code_lower = this.state.product_code.toLowerCase();
    for (let i = 0; i < this.props.clientsObj.length; i++) {
      if (this.props.clientsObj[i].clients === client) {
        this.setState({
          b_client_id: this.props.clientsObj[i].id,
          b_trader: this.props.clientsObj[i].traders[0],
          b_accounts: this.props.clientsObj[i].accounts[0],
          b_recap: this.props.clientsObj[i].recap_emails,
          b_idb: this.props.clientsObj[i].idb,
        });
        if (this.props.clientsObj[i][`commission_${product_code_lower}`]) {
          this.setState({
            b_comms: this.props.clientsObj[i][
              `commission_${product_code_lower}`
            ],
          });
        } else {
          this.setState({
            b_comms: this.props.clientsObj[i].commission,
          });
        }
      }
    }
  };
  //commission to set as commission_productcode
  handleChangeS = (x) => (e) => {
    this.setState({ [x]: e.target.value });
    let client = e.target.value;
    let product_code_lower = this.state.product_code.toLowerCase();
    for (let i = 0; i < this.props.clientsObj.length; i++) {
      if (this.props.clientsObj[i].clients === client) {
        this.setState({
          s_trader: this.props.clientsObj[i].traders[0],
          s_client_id: this.props.clientsObj[i].id,
          s_accounts: this.props.clientsObj[i].accounts[0],
          s_recap: this.props.clientsObj[i].recap_emails,
          s_idb: this.props.clientsObj[i].idb,
        });
        if (this.props.clientsObj[i][`commission_${product_code_lower}`]) {
          this.setState({
            s_comms: this.props.clientsObj[i][
              `commission_${product_code_lower}`
            ],
          });
        } else {
          this.setState({
            s_comms: this.props.clientsObj[i].commission,
          });
        }
      }
    }
  };

  loopFunc(x, y) {
    for (let i = 0; i < this.props.clientsObj.length; i++) {
      if (this.state.b_client === this.props.clientsObj[i].clients) {
        for (let j = 0; j < this.props.clientsObj[i][x].length; j++) {
          if (j === 0) {
            y.push(
              <option
                defaultValue
                key={j}
                value={this.props.clientsObj[i][x][j]}
              >
                {this.props.clientsObj[i][x][j]}
              </option>
            );
          } else {
            y.push(
              <option key={j} value={this.props.clientsObj[i][x][j]}>
                {this.props.clientsObj[i][x][j]}
              </option>
            );
          }
        }
      }
    }
  }

  sloopFunc(x, y) {
    for (let i = 0; i < this.props.clientsObj.length; i++) {
      if (this.state.s_client === this.props.clientsObj[i].clients) {
        for (let j = 0; j < this.props.clientsObj[i][x].length; j++) {
          if (j === 0) {
            y.push(
              <option
                defaultValue
                key={j}
                value={this.props.clientsObj[i][x][j]}
              >
                {this.props.clientsObj[i][x][j]}
              </option>
            );
          } else {
            y.push(
              <option key={j} value={this.props.clientsObj[i][x][j]}>
                {this.props.clientsObj[i][x][j]}
              </option>
            );
          }
        }
      }
    }
  }
  //get month in number
  getMon = (month) => {
    return "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(month) / 3 + 1;
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

  allege = (entity) => {
    if (this.state.b_idb === "S664" && entity === "HK") {
      this.setState({
        b_client: "",
        b_trader: "",
        b_accounts: "",
        b_recap: "",
        b_comms: "",
      });
    }
    if (this.state.s_idb === "S664" && entity === "HK") {
      this.setState({
        s_client: "",
        s_trader: "",
        s_accounts: "",
        s_recap: "",
        s_comms: "",
      });
    }
    if (this.state.b_idb === "S674" && entity === "SG") {
      this.setState({
        b_client: "",
        b_trader: "",
        b_accounts: "",
        b_recap: "",
        b_comms: "",
      });
    }
    if (this.state.s_idb === "S674" && entity === "SG") {
      this.setState({
        s_client: "",
        s_trader: "",
        s_accounts: "",
        s_recap: "",
        s_comms: "",
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
      s_recap: b_recap,
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
      year: new Date().getFullYear(),
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

  spreadComms = (dir) => {
    if (dir === "buyer") {
      this.setState({ b_comms: this.state.b_comms / 2 });
    } else if (dir === "seller") {
      this.setState({ s_comms: this.state.s_comms / 2 });
    }
  };

  handleCsv = () => {
    let toM = this.getMon(this.state.toM);
    let fromM = this.getMon(this.state.fromM);
    let consMonth = toM - fromM + 1;
    let date = this.state.execDate.split("-");
    let execDate = date[2] + "/" + date[1] + "/" + date[0];
    let gcmB = "";
    let gcmS = "";
    try {
      if (this.state.b_accounts.length && this.state.s_accounts.length) {
        gcmB = this.state.b_accounts.split(" ")[1];
        gcmS = this.state.s_accounts.split(" ")[1];
      } else if (this.state.s_accounts.length) {
        gcmS = this.state.s_accounts.split(" ")[1];
      } else if (this.state.b_accounts.length) {
        gcmB = this.state.b_accounts.split(" ")[1];
      }
    } catch (e) {
      console.error(e);
    }

    let oet = "NLT";
    if (this.state.instrument === "S") {
      oet = "OTC";
    }

    const rows = [
      this.state.dealGroup,
      "Outright",
      "1",
      execDate,
      this.state.execTime,
      this.state.product_code,
      fromM.toString() + "/" + this.state.year,
      this.state.instrument,
      oet,
      this.state.strike,
      consMonth,
      "S",
      this.state.qty,
      this.state.price,
      this.state.s_idb,
      gcmS,
      this.state.s_accounts,
      "",
      this.state.b_idb,
      gcmB,
      this.state.b_accounts,
      "",
    ];
    //append csv
    this.setState({
      arrayCsv: [...this.state.arrayCsv, rows],
      dealGroup: parseInt(this.state.dealGroup) + 1,
    });
  };

  download = () => {
    let csvContent =
      "data:text/csv;charset=utf-8," +
      this.state.arrayCsv.map((e) => e.join(",")).join("\n");
    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  };

  handleSubmit = (e) => {
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
    } else if (fromM === 1 && consMonth === 6) {
      contract = "1H'" + this.state.year;
    } else if (fromM === 7 && consMonth === 6) {
      contract = "2H'" + this.state.year;
    } else if (fromM === 1 && consMonth === 12) {
      contract = "CAL'" + this.state.year;
    } else if (fromM === toM) {
      contract = this.state.fromM + "'" + this.state.year;
    } else {
      contract =
        this.state.fromM +
        "'" +
        this.state.year +
        " - " +
        this.state.toM +
        "'" +
        this.state.year;
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
        contract: contract,
      };
      // post to transaction
      fetch("/api/transactions", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataState),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("this is a success on transactions!!");
          const newData = { ...dataState, tradeid: data[0].id };
          //post to email
          fetch("/send", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newData),
          })
            .then(() => {
              console.log("this is a success to email");
              alert("Email successfully sent");
            })
            .catch((error) => {
              console.error("error: ", error);
              alert("Error in sending email, please try again");
            });
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
          ref={(ref) => {
            this.InputLabelRef = ref;
          }}
        >
          Year
        </InputLabel>
        <Select
          native
          inputProps={{
            classes: {
              select: classes.resize,
            },
          }}
          name="year"
          value={this.state.year}
          onChange={this.handleChange}
          input={
            <OutlinedInput name="year" labelWidth={this.state.labelWidth} />
          }
        >
          <option value="2020" defaultValue>
            2020
          </option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </Select>
      </FormControl>
    );

    return (
      <Fdashboard>
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
                  style: { fontSize: 13, lineHeight: 1 },
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
                  style: { fontSize: 13, lineHeight: 1 },
                }}
                value={this.state.execTime}
                onChange={this.handleChange}
                variant="outlined"
              />
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
              {/* <TextField
              className={classes.textControl}
              label="Buy Broker"
              name="b_broker"
              value={this.state.b_broker}
              onChange={this.handleChange}
              inputProps={{
                style: { fontSize: 13, lineHeight: 1 }
              }}
              variant="outlined"
            /> */}

              <FormControl className={classes.formControl} variant="outlined">
                <InputLabel
                  ref={(ref) => {
                    this.InputLabelRef = ref;
                  }}
                >
                  Buy Broker
                </InputLabel>
                <Select
                  inputProps={{
                    classes: {
                      select: classes.resize,
                    },
                  }}
                  native
                  name="b_broker"
                  value={this.state.b_broker}
                  onChange={this.handleChange}
                  input={
                    <OutlinedInput
                      name="b_Broker"
                      labelWidth={this.state.labelWidth}
                    />
                  }
                >
                  {this.state.brokers.map((broker, index) => (
                    <option key={index} value={broker.name}>
                      {broker.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* <TextField
              className={classes.textControl}
              label="Sell Broker"
              name="s_broker"
              value={this.state.s_broker}
              onChange={this.handleChange}
              inputProps={{
                style: { fontSize: 13, lineHeight: 1 }
              }}
              variant="outlined"
            /> */}

              <FormControl className={classes.formControl} variant="outlined">
                <InputLabel
                  ref={(ref) => {
                    this.InputLabelRef = ref;
                  }}
                >
                  Sell Broker
                </InputLabel>
                <Select
                  inputProps={{
                    classes: {
                      select: classes.resize,
                    },
                  }}
                  native
                  name="s_broker"
                  value={this.state.s_broker}
                  onChange={this.handleChange}
                  input={
                    <OutlinedInput
                      name="s_broker"
                      labelWidth={this.state.labelWidth}
                    />
                  }
                >
                  {this.state.brokers.map((broker, index) => (
                    <option key={index} value={broker.name}>
                      {broker.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </div>
            <br />
            <div className={classes.midbutton}>
              <FormControl className={classes.formControl} variant="outlined">
                <InputLabel
                  ref={(ref) => {
                    this.InputLabelRef = ref;
                  }}
                >
                  Product
                </InputLabel>
                <Select
                  inputProps={{
                    classes: {
                      select: classes.resize,
                    },
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
                  {this.props.productsObj.map((code, index) => (
                    <option key={index} value={code.code}>
                      {code.code}&nbsp;&nbsp;&nbsp;{code.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl className={classes.formControl} variant="outlined">
                <InputLabel
                  ref={(ref) => {
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
                      select: classes.resize,
                    },
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
                  ref={(ref) => {
                    this.InputLabelRef = ref;
                  }}
                >
                  Buyer
                </InputLabel>
                <Select
                  inputProps={{
                    classes: {
                      select: classes.resize,
                    },
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
                  {this.props.clients.map((client, index) => (
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
                  style: { fontSize: 13, lineHeight: 1 },
                }}
                variant="outlined"
              />
            </div>
            <br />
            <div className={classes.midbutton}>
              <FormControl className={classes.formControl} variant="outlined">
                <InputLabel
                  ref={(ref) => {
                    this.InputLabelRef = ref;
                  }}
                >
                  Trader
                </InputLabel>
                <Select
                  inputProps={{
                    classes: {
                      select: classes.resize,
                    },
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
                  {b_traders.map((trader) => trader)}
                </Select>
              </FormControl>
              <FormControl className={classes.formControl} variant="outlined">
                <InputLabel
                  ref={(ref) => {
                    this.InputLabelRef = ref;
                  }}
                >
                  Accounts
                </InputLabel>
                <Select
                  inputProps={{
                    classes: {
                      select: classes.resize,
                    },
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
                  {b_accounts.map((account) => account)}
                </Select>
              </FormControl>
              <TextField
                className={classes.textControl}
                label="Commission"
                required={true}
                name="b_comms"
                type="number"
                inputProps={{
                  step: 0.01,
                  style: { fontSize: 13, lineHeight: 1 },
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
                  ref={(ref) => {
                    this.InputLabelRef = ref;
                  }}
                >
                  From Month
                </InputLabel>
                <Select
                  inputProps={{
                    classes: {
                      select: classes.resize,
                    },
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
                  ref={(ref) => {
                    this.InputLabelRef = ref;
                  }}
                >
                  To Month
                </InputLabel>
                <Select
                  inputProps={{
                    classes: {
                      select: classes.resize,
                    },
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
              <Button
                variant="contained"
                color="default"
                onClick={this.handleQ1}
              >
                Q1
              </Button>
              <span>&nbsp;&nbsp;</span>
              <Button
                variant="contained"
                color="default"
                onClick={this.handleQ2}
              >
                Q2
              </Button>
              <span>&nbsp;&nbsp;</span>
              <Button
                variant="contained"
                color="default"
                onClick={this.handleQ3}
              >
                Q3
              </Button>
              <span>&nbsp;&nbsp;</span>
              <Button
                variant="contained"
                color="default"
                onClick={this.handleQ4}
              >
                Q4
              </Button>
            </div>
            <br />
            <div className={classes.midbutton}>
              <FormControl className={classes.formControl} variant="outlined">
                <InputLabel
                  ref={(ref) => {
                    this.InputLabelRef = ref;
                  }}
                >
                  Seller
                </InputLabel>
                <Select
                  inputProps={{
                    classes: {
                      select: classes.resize,
                    },
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
                  {this.props.clients.map((client, index) => (
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
                  style: { fontSize: 13, lineHeight: 1 },
                }}
                variant="outlined"
              />
            </div>
            <br />
            <div className={classes.midbutton}>
              <FormControl className={classes.formControl} variant="outlined">
                <InputLabel
                  ref={(ref) => {
                    this.InputLabelRef = ref;
                  }}
                >
                  Trader
                </InputLabel>
                <Select
                  inputProps={{
                    classes: {
                      select: classes.resize,
                    },
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
                  {s_traders.map((trader) => trader)}
                </Select>
              </FormControl>
              <FormControl className={classes.formControl} variant="outlined">
                <InputLabel
                  ref={(ref) => {
                    this.InputLabelRef = ref;
                  }}
                >
                  Accounts
                </InputLabel>
                <Select
                  inputProps={{
                    classes: {
                      select: classes.resize,
                    },
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
                  {s_accounts.map((account) => account)}
                </Select>
              </FormControl>
              <TextField
                className={classes.textControl}
                label="Commission"
                required={true}
                name="s_comms"
                type="number"
                inputProps={{
                  step: 0.01,
                  style: { fontSize: 13, lineHeight: 1 },
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
                required={true}
                inputProps={{
                  step: 0.05,
                  style: { fontSize: 13, lineHeight: 1 },
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
                inputProps={{
                  step: 50,
                  style: { fontSize: 13, lineHeight: 1 },
                }}
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
                  style: { fontSize: 13, lineHeight: 1 },
                }}
                value={this.state.strike}
                onChange={this.handleChange}
                variant="outlined"
              />
              <TextField
                className={classes.textControl}
                label="Deal Id"
                name="deal_id"
                type="number"
                inputProps={{
                  step: 0.05,
                  style: { fontSize: 13, lineHeight: 1 },
                }}
                value={this.state.deal_id}
                onChange={this.handleChange}
                variant="outlined"
              />
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            </div>
            <br />
            {/* <div className={classes.midbutton}>
              <Button onClick={() => this.allege("HK")} variant="contained">
                Allege HK
              </Button>
              <span>&nbsp;&nbsp;</span>
              <Button onClick={() => this.allege("SG")} variant="contained">
                Allege SG
              </Button>
            </div>
            <br /> */}
            <div className={classes.midbutton}>
              <Button type="submit" variant="contained" color="primary">
                Submit Recap
              </Button>
              <span>&nbsp;&nbsp;</span>
              {/* <Button
                onClick={this.handleCsv}
                variant="contained"
                color="primary"
              >
                Append
              </Button>
              <span>&nbsp;&nbsp;</span>
              <Button
                onClick={this.download}
                variant="contained"
                color="primary"
              >
                CSV download
              </Button> */}
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
          {/* <br />
          <br />
          <div>
            <table>
              <tbody>
                {this.state.arrayCsv.map((row, index) => (
                  <tr key={index}>
                    {row.map((item, index) => (
                      <td key={index}>{item}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div> */}
        </div>
      </Fdashboard>
    );
  }
}

const mapStateToProps = (state) => ({
  clients: state.clients.clients,
  clientsObj: state.clients.clientsObj,
  loading: state.clients.loading,
  error: state.clients.error,
  isAuth: state.clients.isAuth,
  productsObj: state.clients.productsObj,
});

export default connect(mapStateToProps)(withStyles(styles)(Form));
