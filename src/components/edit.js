import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
// import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
//unable to import props from index.js so have to use withRouter
import { withRouter } from "react-router-dom";
import Fdashboard from "./dashboard/fdashboard";

import { MyContext } from "./store/createContext";
import axios from "axios";

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
    flexDirection: "column",
    alignItems: "center",
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

class Edit extends Component {
  state = {
    data: "",
    tradeid: "",
    deal_id: "",
    b_commission: "",
    s_commission: "",
    qty: "",
    product_code: "",
    price: "",
    productsObj: [],
    instruObj: [],
  };

  async componentDidMount() {
    await fetch(`/api/transactions/${this.props.match.params.id}`)
      .then((res) => res.json())
      .then((data) => {
        //poor naming convention thus requiring renaming some variables
        data["tradeid"] = data.id;
        data["product_code"] = data.product;
        data["consMonth"] = data.consmonth;
        if (data.strike === "NaN") {
          data.strike = "";
        }
        data["b_accounts"] = data.b_account;
        data["s_accounts"] = data.s_account;
        data["b_comms"] = data.b_commission;
        data["s_comms"] = data.s_commission;

        for (let i = 0; i < this.context.clients.length; i++) {
          if (data.b_clientid === this.context.clients[i].id) {
            data["b_recap"] = this.context.clients[i].recap_emails;
          } else if (data.s_clientid === this.context.clients[i].id) {
            data["s_recap"] = this.context.clients[i].recap_emails;
          }
        }
        //for making a select dropdown for product_code
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

        this.setState({ data });
        this.setState({
          tradeid: data.id,
          deal_id: data.deal_id,
          qty: data.qty,
          b_commission: data.b_comms,
          s_commission: data.s_comms,
          product_code: data.product_code,
          price: data.price,
        });
      });
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  return = () => {
    this.props.history.push("/transactions");
  };

  createPdf = () => {
    let data = {
      ...this.state.data,
      tradeid: this.state.data.id,
      b_comms: this.state.data.b_commission,
      s_comms: this.state.data.s_commission,
      product_code: this.state.data.product,
      b_accounts: this.state.data.b_account,
      s_accounts: this.state.data.s_account,
      consMonth: this.state.data.consmonth,
    };
    axios
      .post("/createrecappdf", data)
      .then(() => axios.get("/getrecappdf", { responseType: "blob" }))
      .then((res) => {
        // const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        // saveAs(pdfBlob, `testing.pdf`);
      });
  };

  resendSeller = () => {
    console.log("resend email", this.state.data);

    fetch("/sendSeller", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.data),
    })
      .then(() => {
        console.log("this is a success to email");
        alert("Email successfully sent");
      })
      .catch((error) => {
        console.error("error: ", error);
        alert("Error in sending email, please try again");
      });
  };

  resendBuyer = () => {
    console.log("resend email", this.state.data);

    fetch("/sendBuyer", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.data),
    })
      .then(() => {
        console.log("this is a success to email");
        alert("Email successfully sent");
      })
      .catch((error) => {
        console.error("error: ", error);
        alert("Error in sending email, please try again");
      });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const data = { ...this.state };
    fetch(`/api/transactions/${this.state.tradeid}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => {
      console.log("success posting deal_id");
      this.props.history.push("/transactions");
    });
  };

  render() {
    const { classes } = this.props;
    const { data } = this.state;
    console.log(data);
    let date = new Date(data.created_at);
    let trade_date = new Date(data.trade_date).toLocaleDateString();
    let date_time = date.toLocaleDateString() + " " + date.toLocaleTimeString();

    return (
      <Fdashboard>
        {/* <Paper className={classes.root}> */}
        <form onSubmit={this.handleSubmit}>
          <Table>
            <TableHead>
              <TableRow>
                <CustomTableCell align="center">Trade Id</CustomTableCell>
                <CustomTableCell align="center">Trade date</CustomTableCell>
                <CustomTableCell align="center">Product</CustomTableCell>
                <CustomTableCell align="center">Instrument</CustomTableCell>
                <CustomTableCell align="center">Client buy</CustomTableCell>
                <CustomTableCell align="center">Acct buy</CustomTableCell>
                <CustomTableCell align="center">Trader buy</CustomTableCell>
                <CustomTableCell align="center">Comms buy</CustomTableCell>
                <CustomTableCell align="center">Client sell</CustomTableCell>
                <CustomTableCell align="center">Acct sell</CustomTableCell>
                <CustomTableCell align="center">Trader sell</CustomTableCell>
                <CustomTableCell align="center">Comms sell</CustomTableCell>
                <CustomTableCell align="center">Strike</CustomTableCell>
                <CustomTableCell align="center">Price</CustomTableCell>
                <CustomTableCell align="center">Quantity</CustomTableCell>
                <CustomTableCell align="center">Contract</CustomTableCell>
                <CustomTableCell align="center">Deal Id</CustomTableCell>
                <CustomTableCell align="center">Created by</CustomTableCell>
                <CustomTableCell align="center">
                  Created at (GMT +8)
                </CustomTableCell>
                <CustomTableCell align="center">Edit</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={data.trade_id}>
                <CustomTableCell align="center" component="th" scope="row">
                  {data.id}
                </CustomTableCell>
                <CustomTableCell align="center">{trade_date}</CustomTableCell>
                <CustomTableCell align="center">
                  <TextField
                    name="product_code"
                    label="Product"
                    className={classes.textField}
                    value={this.state.product_code}
                    inputProps={{
                      style: { fontSize: 11, width: 80 },
                    }}
                    onChange={this.handleChange}
                    // margin="normal"
                    variant="outlined"
                  />
                </CustomTableCell>
                <CustomTableCell align="center">
                  {data.instrument}
                </CustomTableCell>
                <CustomTableCell align="center">
                  {data.b_client}
                </CustomTableCell>
                <CustomTableCell align="center">
                  {data.b_account}
                </CustomTableCell>
                <CustomTableCell align="center">
                  {data.b_trader}
                </CustomTableCell>
                <CustomTableCell align="center">
                  <TextField
                    type="number"
                    name="b_commission"
                    label="Buy_Comms"
                    className={classes.textField}
                    value={this.state.b_commission}
                    inputProps={{
                      step: 0.01,
                      style: { fontSize: 11, width: 80 },
                    }}
                    onChange={this.handleChange}
                    // margin="normal"
                    variant="outlined"
                  />
                </CustomTableCell>
                <CustomTableCell align="center">
                  {data.s_client}
                </CustomTableCell>
                <CustomTableCell align="center">
                  {data.s_account}
                </CustomTableCell>
                <CustomTableCell align="center">
                  {data.s_trader}
                </CustomTableCell>
                <CustomTableCell align="center">
                  <TextField
                    type="number"
                    name="s_commission"
                    label="Sell_Comms"
                    className={classes.textField}
                    value={this.state.s_commission}
                    inputProps={{
                      step: 0.01,
                      style: { fontSize: 11, width: 80 },
                    }}
                    onChange={this.handleChange}
                    // margin="normal"
                    variant="outlined"
                  />
                </CustomTableCell>
                <CustomTableCell align="center">{data.strike}</CustomTableCell>
                <CustomTableCell align="center">
                  <TextField
                    type="number"
                    name="price"
                    label="Price"
                    className={classes.textField}
                    value={this.state.price}
                    inputProps={{
                      style: { fontSize: 11, width: 80 },
                    }}
                    onChange={this.handleChange}
                    // margin="normal"
                    variant="outlined"
                  />
                </CustomTableCell>
                <CustomTableCell align="center">
                  <TextField
                    type="number"
                    name="qty"
                    label="Quantity"
                    className={classes.textField}
                    value={this.state.qty}
                    inputProps={{
                      style: { fontSize: 11, width: 50 },
                    }}
                    onChange={this.handleChange}
                    // margin="normal"
                    variant="outlined"
                  />
                </CustomTableCell>
                <CustomTableCell align="center">
                  {data.contract}
                </CustomTableCell>
                <CustomTableCell align="center">
                  <TextField
                    type="number"
                    name="deal_id"
                    label="Deal id"
                    className={classes.textField}
                    value={this.state.deal_id}
                    inputProps={{
                      style: { fontSize: 11, width: 80 },
                    }}
                    onChange={this.handleChange}
                    // margin="normal"
                    variant="outlined"
                  />
                </CustomTableCell>
                <CustomTableCell align="center">
                  {data.created_by}
                </CustomTableCell>
                <CustomTableCell align="center">{date_time}</CustomTableCell>
                <CustomTableCell align="center">
                  <Button
                    size="medium"
                    variant="outlined"
                    color="primary"
                    type="submit"
                  >
                    Submit
                  </Button>
                </CustomTableCell>
              </TableRow>
            </TableBody>
          </Table>
        </form>
        <br />
        <Button
          color="primary"
          margin="normal"
          variant="outlined"
          onClick={this.resendBuyer}
        >
          Resend Buyer
        </Button>
        &nbsp;&nbsp;
        <Button
          color="primary"
          margin="normal"
          variant="outlined"
          onClick={this.resendSeller}
        >
          Resend Seller
        </Button>
        &nbsp;&nbsp;
        <Button variant="outlined" margin="normal" onClick={this.return}>
          back
        </Button>
        {/* </Paper> */}
        <br />
        <br />
        *Please submit changes before resending recaps
      </Fdashboard>
    );
  }
}

Edit.propTypes = {
  classes: PropTypes.object.isRequired,
};

Edit.contextType = MyContext;

export default withRouter(withStyles(styles)(Edit));
