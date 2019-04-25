import React, { Component } from "react";
import MUIDataTable from "mui-datatables";

class Transactions extends Component {
  state = { data: "", data_filtered: [] };

  async componentDidMount() {
    try {
      await fetch("/api/transactions", {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token")
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log(data, "data from trasactions current date");
          this.setState({ data });
          console.log(data);
        });
    } catch (e) {
      console.log(e, "error getting transactions due to permissions");
    }
  }
  render() {
    const columnsAll = [
      "Trade_id",
      "trade_date",
      "Trade_time",
      "Client_buyer",
      "Account_buyer",
      "Trader_buyer",
      "Comms_buyer",
      "Client_seller",
      "Account_seller",
      "Trader_seller",
      "Comms_seller",
      "Price",
      "Quantity",
      "Contract",
      "Year",
      "Deal_id",
      "Created_by",
      "Created_at"
    ];

    //all
    for (let i = 0; i < this.state.data.length; i++) {
      let array = [];
      array.push(this.state.data[i].id);
      array.push(this.state.data[i].trade_date);
      array.push(this.state.data[i].trade_time);
      array.push(this.state.data[i].b_client);
      array.push(this.state.data[i].b_account);
      array.push(this.state.data[i].b_trader);
      array.push(this.state.data[i].b_commission);
      array.push(this.state.data[i].s_client);
      array.push(this.state.data[i].s_account);
      array.push(this.state.data[i].s_trader);
      array.push(this.state.data[i].s_commission);
      array.push(this.state.data[i].price);
      array.push(this.state.data[i].qty);
      array.push(this.state.data[i].contract);
      array.push(this.state.data[i].year);
      array.push(this.state.data[i].deal_id);
      array.push(this.state.data[i].created_by_id);
      array.push(this.state.data[i].created_at);
      this.state.data_filtered.push(array);
    }

    const options = {
      filterType: "checkbox",
      resizableColumns: "true"
    };

    return (
      <div>
        <MUIDataTable
          title={"Buyers"}
          data={this.state.data_filtered}
          columns={columnsAll}
          options={options}
        />
      </div>
    );
  }
}

export default Transactions;
