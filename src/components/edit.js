import React, { Component } from "react";

class Edit extends Component {
  state = { data: "", tradeid: "", dealid: "" };

  async componentDidMount() {
    await fetch(`/api/transactions/${this.props.match.params.id}`)
      .then(res => res.json())
      .then(data => {
        this.setState({ data });
        this.setState({ tradeid: data.id });
      });

    console.log(this.state.data, "edit data");
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  return = () => {
    this.props.history.push("/");
  };

  handleSubmit = e => {
    e.preventDefault();

    const data = { ...this.state };
    fetch(`/api/transactions/${this.state.tradeid}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(() => {
      console.log("success posting deal_id");
    });
  };

  render() {
    let data = this.state.data;
    console.log(typeof data.trade_date);
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div>{data.id}</div>
          <div>{data.trade_date && data.trade_date.substring(0, 10)}</div>
          <div>{data.trade_time}</div>
          <div>{data.b_client}</div>
          <div>{data.b_account}</div>
          <div>{data.b_trader}</div>
          <div>{data.b_comms}</div>
          <div>{data.s_client}</div>
          <div>{data.s_account}</div>

          <div>{data.s_trader}</div>
          <div>{data.s_comms}</div>
          <div>{data.price}</div>
          <div>{data.qty}</div>
          <div>
            <label>Deal id</label>
            <input
              name="dealid"
              value={this.state.dealid}
              onChange={this.handleChange}
            />
          </div>
          <div>
            <input type="submit" value="Submit" />
          </div>
        </form>
        <button onClick={this.return}>back</button>
      </div>
    );
  }
}

export default Edit;
