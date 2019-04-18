import React, { Component } from "react";

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
    product_code: "FEF",
    products: [],
    fromM: "Apr",
    toM: "Apr",
    year: "2019",
    price: "",
    qty: "",
    execTime: "",
    execDate: "",
    dealGroup: 1
  };

  componentDidMount() {
    let date = new Date();
    let month;
    let day;
    // let exec_date =
    //   date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    // console.log(this.state.execDate, date.toLocaleTimeString(), "exec date");
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

    fetch("/api/clients")
      .then(res => res.json())
      .then(data => {
        // console.log("api result of clients:", data);
        let clients = [" "];
        let clientsObj = [];
        for (let i = 0; i < data.length; i++) {
          clients.push(data[i].client_name);
        }
        clients = [...new Set(clients)];
        for (let i = 0; i < clients.length; i++) {
          let traders = [];
          let products = [];
          let product_code = [];
          let gcms = [];
          let gcms_code = [];
          let accounts = [];
          let recap_emails = "";
          let commission = 0;

          for (let j = 0; j < data.length; j++) {
            if (data[j].client_name === clients[i]) {
              traders.push(data[j].trader_name);
              products.push(data[j].product_name);
              product_code.push(data[j].product_code);
              gcms.push(data[j].gcm_name);
              gcms_code.push(data[j].gcm_code);
              accounts.push(data[j].account);
              recap_emails = data[j].recap_emails;
              commission = data[j].commission;
            }
          }
          clientsObj.push({
            clients: clients[i],
            product_code: [...new Set(product_code)],
            products: [...new Set(products)],
            gcms_code: [...new Set(gcms_code)],
            gcms: [...new Set(gcms)],
            accounts: [...new Set(accounts)],
            traders: [...new Set(traders)],
            commission: commission,
            recap_emails: recap_emails
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
      }
    }
  };

  loopFunc(x, y) {
    for (let i = 0; i < this.state.value.length; i++) {
      if (this.state.b_client === this.state.value[i].clients) {
        for (let j = 0; j < this.state.value[i][x].length; j++) {
          if (j === 0) {
            y.push(
              <option selected key={j} value={this.state.value[i][x][j]}>
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
              <option selected key={j} value={this.state.value[i][x][j]}>
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

  handleSubmit = e => {
    e.preventDefault();

    let toM = this.getMon(this.state.toM);
    let fromM = this.getMon(this.state.fromM);
    let consMonth = (toM - fromM + 1).toString();
    //date to change
    let date = new Date();
    let execDate =
      date.getDate() + 1 + "/" + date.getMonth() + "/" + date.getFullYear();
    let gcmB;
    let gcmS;
    if (this.state.b_accounts.length > 0 && this.state.s_accounts.length > 0) {
      gcmB = this.state.b_accounts.split(" ")[1];
      gcmS = this.state.s_accounts.split(" ")[1];
    } else if (this.state.s_accounts.length > 0) {
      gcmS = this.state.s_accounts.split(" ")[1];
    } else if (this.state.b_accounts.length > 0) {
      gcmB = this.state.b_accounts.split(" ")[1];
    } else {
      gcmB = "";
      gcmS = "";
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
        "F",
        "NLT",
        "",
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
    //download to csv
    let csvContent =
      "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);

    // console.log(this.state, "states passing through");
    const data = { ...this.state };
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
  };

  render() {
    let b_traders = [];
    let b_accounts = [];
    let s_traders = [];
    let s_accounts = [];

    this.loopFunc("traders", b_traders);
    this.loopFunc("accounts", b_accounts);
    this.sloopFunc("traders", s_traders);
    this.sloopFunc("accounts", s_accounts);

    let year = (
      <select
        name="year"
        value={this.state.year}
        onChange={this.handleChange}
        multiple={false}
      >
        <option value="2019" selected>
          2019
        </option>
        <option value="2020">2020</option>
        <option value="2021">2021</option>
        <option value="2021">2022</option>
      </select>
    );
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          Deal group:
          <input
            name="dealGroup"
            value={this.state.dealGroup}
            onChange={this.handleChange}
          />
          <br />
          Trade time:
          <input
            name="execTime"
            value={this.state.execTime}
            type="time"
            min="08:00"
            onChange={this.handleChange}
          />
          Trade date:
          <input
            name="execDate"
            value={this.state.execDate}
            type="date"
            onChange={this.handleChange}
          />
          <br />
          <select
            name="product_code"
            value={this.state.product_code}
            onChange={this.handleChange}
            multiple={false}
          >
            {this.state.productsObj.map((code, index) => (
              <option key={index} value={code.code}>
                {code.code}
              </option>
            ))}
          </select>
          <select
            name="products"
            value={this.state.products}
            onChange={this.handleChange}
            multiple={false}
          >
            {this.state.productsObj.map((name, index) => (
              <option key={index} value={name.name}>
                {name.name}
              </option>
            ))}
          </select>
          <br />
          Buyer:
          <select
            value={this.state.b_client}
            onChange={this.handleChangeB("b_client")}
            multiple={false}
          >
            {this.state.clients.map((client, index) => (
              <option key={index} value={client}>
                {client}
              </option>
            ))}
          </select>
          <br />
          Traders:
          <select
            name="b_trader"
            value={this.state.b_trader}
            onChange={this.handleChange}
            multiple={false}
          >
            {b_traders.map(trader => trader)}
          </select>
          <br />
          IDB:
          <input
            name="b_idb"
            value={this.state.b_idb}
            onChange={this.handleChange}
          />
          <br />
          Accounts:
          <select
            name="b_accounts"
            value={this.state.b_accounts}
            onChange={this.handleChange}
            multiple={false}
          >
            {b_accounts.map(account => account)}
          </select>
          <br />
          Commission:
          <input
            name="b_comms"
            type="number"
            value={this.state.b_comms}
            onChange={this.handleChange}
          />
          <br />
          From:
          <select
            name="fromM"
            value={this.state.fromM}
            onChange={this.handleChange}
            multiple={false}
          >
            <option value="Jan">Jan</option>
            <option value="Feb">Feb</option>
            <option value="Mar">Mar</option>
            <option value="Apr">Apr</option>
            <option selected value="May">
              May
            </option>
            <option value="Jun">Jun</option>
            <option value="Jul">Jul</option>
            <option value="Aug">Aug</option>
            <option value="Sep">Sep</option>
            <option value="Oct">Oct</option>
            <option value="Nov">Nov</option>
            <option value="Dec">Dec</option>
          </select>
          {year}
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>To:
          <select
            name="toM"
            value={this.state.toM}
            onChange={this.handleChange}
            multiple={false}
          >
            <option value="Jan">Jan</option>
            <option value="Feb">Feb</option>
            <option value="Mar">Mar</option>
            <option value="Apr">Apr</option>
            <option selected value="May">
              May
            </option>
            <option value="Jun">Jun</option>
            <option value="Jul">Jul</option>
            <option value="Aug">Aug</option>
            <option value="Sep">Sep</option>
            <option value="Oct">Oct</option>
            <option value="Nov">Nov</option>
            <option value="Dec">Dec</option>
          </select>
          {year}
          <br />
          Seller:
          <select
            value={this.state.s_client}
            onChange={this.handleChangeS("s_client")}
            multiple={false}
          >
            {this.state.clients.map((client, index) => (
              <option key={index} value={client}>
                {client}
              </option>
            ))}
          </select>
          <br />
          Traders:
          <select
            name="s_trader"
            value={this.state.s_trader}
            onChange={this.handleChange}
            multiple={false}
          >
            {s_traders.map(trader => trader)}
          </select>
          <br />
          IDB:
          <input
            name="s_idb"
            value={this.state.s_idb}
            onChange={this.handleChange}
          />
          <br />
          Accounts:
          <select
            name="s_accounts"
            value={this.state.s_accounts}
            onChange={this.handleChange}
            multiple={false}
          >
            {s_accounts.map(account => account)}
          </select>
          <br />
          Commission:
          <input
            name="s_comms"
            type="number"
            value={this.state.s_comms}
            onChange={this.handleChange}
          />
          <br />
          Price:
          <input
            name="price"
            type="number"
            value={this.state.price}
            onChange={this.handleChange}
          />
          <br />
          Qty:
          <input
            name="qty"
            type="numnber"
            value={this.state.qty}
            onChange={this.handleChange}
          />
          <br />
          <input type="submit" value="submit" />
        </form>
      </div>
    );
  }
}

export default Form;
