import React, { Component } from "react";
import ReactDOM from "react-dom";

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
  }
});

class Form extends Component {
  state = {
    value: [], //full list clients in dictionary
    clients: [], //clients array
    b_client: [], //client select
    s_client: [], //client Sell select
    b_trader: [],
    s_trader: [],
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
    price: 0.0,
    strike: "",
    qty: 50,
    execTime: "",
    execDate: "",
    dealGroup: 1
  };

  componentDidMount() {
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth
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
    this.setState({ execTime: date.toLocaleTimeString().substring(0, 5) });
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
            let traders = [];
            let accounts = [];
            let recap_emails = "";
            let commission = 0;
            let idb = "";

            for (let j = 0; j < data.length; j++) {
              if (data[j].client_name === clients[i]) {
                traders.push(data[j].trader_name);
                accounts.push(data[j].account);
                recap_emails = data[j].recap_emails;
                commission = data[j].commission;
                idb = data[j].idb;
              }
            }
            clientsObj.push({
              clients: clients[i],
              accounts: [...new Set(accounts)],
              traders: [...new Set(traders)],
              commission: commission,
              recap_emails: recap_emails,
              idb: idb
            });
          }
          this.setState({ value: clientsObj });
          this.setState({ clients: clients });
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
    console.log("Fired");
  };

  handleChangeB = x => e => {
    this.setState({ [x]: e.target.value });
    let client = e.target.value;
    for (let i = 0; i < this.state.value.length; i++) {
      if (this.state.value[i].clients === client) {
        this.setState({ b_trader: this.state.value[i].traders[0] });
        this.setState({ b_accounts: this.state.value[i].accounts[0] });
        this.setState({ b_comms: this.state.value[i].commission });
        this.setState({ b_recap: this.state.value[i].recap_emails });
        this.setState({ b_idb: this.state.value[i].idb });
      }
    }
  };

  handleChangeS = x => e => {
    this.setState({ [x]: e.target.value });
    let client = e.target.value;
    for (let i = 0; i < this.state.value.length; i++) {
      if (this.state.value[i].clients === client) {
        this.setState({ s_trader: this.state.value[i].traders[0] });
        this.setState({ s_accounts: this.state.value[i].accounts[0] });
        this.setState({ s_comms: this.state.value[i].commission });
        this.setState({ s_recap: this.state.value[i].recap_emails });
        this.setState({ s_idb: this.state.value[i].idb });
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

  flip = () => {
    let b_client = this.state.b_client;
    let b_trader = this.state.b_trader;
    let b_accounts = this.state.b_accounts;
    let b_comms = this.state.b_comms;
    let s_client = this.state.s_client;
    let s_trader = this.state.s_trader;
    let s_accounts = this.state.s_accounts;
    let s_comms = this.state.s_comms;

    this.setState({
      b_client: s_client,
      b_trader: s_trader,
      b_accounts: s_accounts,
      b_comms: s_comms,
      s_client: b_client,
      s_trader: b_trader,
      s_accounts: b_accounts,
      s_comms: b_comms
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
      s_comms: 0
    });
  };

  handleSubmit = e => {
    e.preventDefault();

    let toM = this.getMon(this.state.toM);
    let fromM = this.getMon(this.state.fromM);
    let consMonth = toM - fromM + 1;
    let date = this.state.execDate.split("-");
    let execDate = date[2] + "/" + date[1] + "/" + date[0];
    let gcmB = "";
    let gcmS = "";
    if (this.state.b_accounts.length > 0 && this.state.s_accounts.length > 0) {
      gcmB = this.state.b_accounts.split(" ")[1];
      gcmS = this.state.s_accounts.split(" ")[1];
    } else if (this.state.s_accounts.length > 0) {
      gcmS = this.state.s_accounts.split(" ")[1];
    } else if (this.state.b_accounts.length > 0) {
      gcmB = this.state.b_accounts.split(" ")[1];
    }
    console.log(fromM, toM, consMonth, "checking to and from");
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

    let oet = "NLT";
    if(this.state.instrument === "S"){
      oet = "OTC"
    }

    const rows = [
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
      ],
      [
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
        ""
      ]
    ];
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
        
        Contract: ${contract}
        Instrument: ${this.state.instrument}
        Price: ${this.state.price}
        Strike: ${this.state.strike}
        Quantity: ${this.state.qty}`
      )
    ) {
      //download to csv
      let csvContent =
        "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
      var encodedUri = encodeURI(csvContent);
      window.open(encodedUri);

      // console.log(this.state, "states passing through");
      const data = { ...this.state, contract: contract };
      //post to email
      fetch("/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }).then(() => {
        console.log("this is a success to email!!");
      });
      // post to transaction
      fetch("/api/transactions", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }).then(() => {
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
          <option value="2021">2022</option>
        </Select>
      </FormControl>
    );

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <TextField
            className={classes.textControl}
            label="Deal Group"
            name="dealGroup"
            type="number"
            inputProps={{ step: 1 }}
            value={this.state.dealGroup}
            onChange={this.handleChange}
            variant="outlined"
          />
          <TextField
            label="Trade date"
            name="execDate"
            type="date"
            value={this.state.execDate}
            onChange={this.handleChange}
            variant="outlined"
          />
          <TextField
            label="Trade Time"
            name="execTime"
            type="time"
            value={this.state.execTime}
            onChange={this.handleChange}
            variant="outlined"
          />
          <br />
          <br />
          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel
              ref={ref => {
                this.InputLabelRef = ref;
              }}
            >
              Product
            </InputLabel>
            <Select
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
            >
              {this.state.instruObj.map((code, index) => (
                <option key={index} value={code.code}>
                  {code.code} - {code.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <br />
          <br />
          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel
              ref={ref => {
                this.InputLabelRef = ref;
              }}
            >
              Buyer
            </InputLabel>
            <Select
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
          <br />
          <br />
          <TextField
            className={classes.textControl}
            label="IDB"
            name="b_idb"
            value={this.state.b_idb}
            onChange={this.handleChange}
            variant="outlined"
          />
          <br />
          <br />
          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel
              ref={ref => {
                this.InputLabelRef = ref;
              }}
            >
              Trader
            </InputLabel>
            <Select
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
            inputProps={{ step: 0.01 }}
            value={this.state.b_comms}
            onChange={this.handleChange}
            variant="outlined"
          />
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
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
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
              onChange={this.handleChange}
              input={
                <OutlinedInput name="toM" labelWidth={this.state.labelWidth} />
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
          <br />
          <br />
          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel
              ref={ref => {
                this.InputLabelRef = ref;
              }}
            >
              Seller
            </InputLabel>
            <Select
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
          <br />
          <br />
          <TextField
            className={classes.textControl}
            label="IDB"
            name="s_idb"
            value={this.state.s_idb}
            onChange={this.handleChange}
            variant="outlined"
          />
          <br />
          <br />
          <FormControl className={classes.formControl} variant="outlined">
            <InputLabel
              ref={ref => {
                this.InputLabelRef = ref;
              }}
            >
              Trader
            </InputLabel>
            <Select
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
            inputProps={{ step: 0.01 }}
            value={this.state.s_comms}
            onChange={this.handleChange}
            variant="outlined"
          />
          <br />
          <br />
          <TextField
            className={classes.textControl}
            label="Price"
            name="price"
            type="number"
            inputProps={{ step: 0.05 }}
            value={this.state.price}
            onChange={this.handleChange}
            variant="outlined"
          />
          <TextField
            className={classes.textControl}
            label="Quantity"
            name="qty"
            type="number"
            inputProps={{ step: 50 }}
            value={this.state.qty}
            onChange={this.handleChange}
            variant="outlined"
          />
          <TextField
            className={classes.textControl}
            label="Strike"
            name="strike"
            type="number"
            inputProps={{ step: 0.05 }}
            value={this.state.strike}
            onChange={this.handleChange}
            variant="outlined"
          />
          <br />
          <br />
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
        <br />
        <Button onClick={this.flip} variant="contained" color="default">
          Flip
        </Button>
        <span>&nbsp;&nbsp;</span>
        <Button onClick={this.clear} variant="contained" color="default">
          Clear
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(Form);
