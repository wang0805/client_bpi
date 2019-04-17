import React, { Component } from "react";

class Form extends Component {
  state = {
    value: [], //full list clients in dictionary
    clients: [], //clients array
    clientB: [], //client select
    clientS: [], //client Sell select
    traderB: [],
    traderS: [],
    productsObj: [],
    product_code: "FEF",
    products: [],
    accountsB: [],
    accountsS: [],
    fromM: "Apr",
    toM: "Apr",
    year: "2019",
    price: "",
    qty: "",
    execTime: "",
    dealGroup: 1,
    s_idb: "",
    b_idb: "",
    execDate: ""
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
          let commission;

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

  handleChange = x => e => {
    this.setState({ [x]: e.target.value });
    console.log("Fired");
  };

  handleChangeB = x => e => {
    this.setState({ [x]: e.target.value });
    let client = e.target.value;
    for (let i = 0; i < this.state.value.length; i++) {
      if (this.state.value[i].clients === client) {
        this.setState({ traderB: this.state.value[i].traders[0] });
        this.setState({ accountsB: this.state.value[i].accounts[0] });
      }
    }
  };

  handleChangeS = x => e => {
    this.setState({ [x]: e.target.value });
    let client = e.target.value;
    for (let i = 0; i < this.state.value.length; i++) {
      if (this.state.value[i].clients === client) {
        this.setState({ traderS: this.state.value[i].traders[0] });
        this.setState({ accountsS: this.state.value[i].accounts[0] });
      }
    }
  };

  loopFunc(x, y) {
    for (let i = 0; i < this.state.value.length; i++) {
      if (this.state.clientB === this.state.value[i].clients) {
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
      if (this.state.clientS === this.state.value[i].clients) {
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

  // loopFunc(x, y) {
  //   if (this.state.value.length > 0 && this.state.client.length === 1) {
  //     let test = [...this.state.value];
  //     let client = test.filter(client => client.clients === this.state.client);
  //     console.log(client);
  //     for (let j = 0; j < client[0][x].length; j++) {
  //       y.push(
  //         <option key={j} value={client[0][x][j]}>
  //           {client[0][x][j]}
  //         </option>
  //       );
  //     }
  //   }
  // }

  getMon = month => {
    return "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(month) / 3 + 1;
  };

  handleSubmit = e => {
    e.preventDefault();
    let toM = this.getMon(this.state.toM);
    let fromM = this.getMon(this.state.fromM);
    let consMonth = (toM - fromM + 1).toString();
    let date = new Date();
    let execDate =
      date.getDate() + 1 + "/" + date.getMonth() + "/" + date.getFullYear();
    let gcmB;
    let gcmS;
    if (this.state.accountsB.length > 0 && this.state.accountsS.length > 0) {
      gcmB = this.state.accountsB.split(" ")[1];
      gcmS = this.state.accountsS.split(" ")[1];
    } else if (this.state.accountsS.length > 0) {
      gcmS = this.state.accountsS.split(" ")[1];
    } else if (this.state.accountsB.length > 0) {
      gcmB = this.state.accountsB.split(" ")[1];
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
        this.state.accountsS,
        "",
        this.state.b_idb,
        gcmB,
        this.state.accountsB,
        ""
      ]
    ];
    let csvContent =
      "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  };

  render() {
    let tradersB = [];
    let accountsB = [];
    let tradersS = [];
    let accountsS = [];

    this.loopFunc("traders", tradersB);
    this.loopFunc("accounts", accountsB);
    this.sloopFunc("traders", tradersS);
    this.sloopFunc("accounts", accountsS);

    let year = (
      <select
        value={this.state.year}
        onChange={this.handleChange("year")}
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
          Deal group:{" "}
          <input
            value={this.state.dealGroup}
            onChange={this.handleChange("dealGroup")}
          />
          Trade time:{" "}
          <input
            value={this.state.execTime}
            type="time"
            min="08:00"
            onChange={this.handleChange("execTime")}
          />
          Trade date:{" "}
          <input
            value={this.state.execDate}
            type="date"
            onChange={this.handleChange("execDate")}
          />
          <br />
          <select
            value={this.state.product_code}
            onChange={this.handleChange("product_code")}
            multiple={false}
          >
            {this.state.productsObj.map((code, index) => (
              <option key={index} value={code.code}>
                {code.code}
              </option>
            ))}
          </select>
          <select
            value={this.state.products}
            onChange={this.handleChange("products")}
            multiple={false}
          >
            {this.state.productsObj.map((name, index) => (
              <option key={index} value={name.name}>
                {name.name}
              </option>
            ))}
          </select>
          <br />
          Buyer:{" "}
          <select
            value={this.state.clientB}
            onChange={this.handleChangeB("clientB")}
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
            value={this.state.traderB}
            onChange={this.handleChange("traderB")}
            multiple={false}
          >
            {tradersB.map(trader => trader)}
          </select>
          <br />
          IDB:
          <input
            value={this.state.b_idb}
            onChange={this.handleChange("b_idb")}
          />
          Accounts:
          <select
            value={this.state.accountsB}
            onChange={this.handleChange("accountsB")}
            multiple={false}
          >
            {accountsB.map(account => account)}
          </select>
          <br />
          From:
          <select
            value={this.state.fromM}
            onChange={this.handleChange("fromM")}
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
            value={this.state.toM}
            onChange={this.handleChange("toM")}
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
          Seller:{" "}
          <select
            value={this.state.clientS}
            onChange={this.handleChangeS("clientS")}
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
            value={this.state.traderS}
            onChange={this.handleChange("traderS")}
            multiple={false}
          >
            {tradersS.map(trader => trader)}
          </select>
          <br />
          IDB:
          <input
            value={this.state.s_idb}
            onChange={this.handleChange("s_idb")}
          />
          Accounts:
          <select
            value={this.state.accountsS}
            onChange={this.handleChange("accountsS")}
            multiple={false}
          >
            {accountsS.map(account => account)}
          </select>
          <br />
          Price:{" "}
          <input
            type="number"
            value={this.state.price}
            onChange={this.handleChange("price")}
          />
          <br />
          Qty:{" "}
          <input
            type="numnber"
            value={this.state.qty}
            onChange={this.handleChange("qty")}
          />
          <br />
          <input type="submit" value="submit" />
        </form>
      </div>
    );
  }
}

export default Form;
