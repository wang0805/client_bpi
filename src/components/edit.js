import React, { Component } from "react";

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import axios from "axios";

import { MyContext } from "./store/createContext";
// import { saveAs } from "file-saver";

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  card: {
    minWidth: 280,
    marginTop: 50,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

class Edit extends Component {
  state = { data: "", tradeid: "", dealid: "" };

  async componentDidMount() {
    console.log(this.context.clients);
    await fetch(`/api/transactions/${this.props.match.params.id}`)
      .then((res) => res.json())
      .then((data) => {
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
        this.setState({ data });
        this.setState({ tradeid: data.id });
        this.setState({ dealid: data.deal_id });
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
    let data = this.state.data;
    // console.log(typeof data.trade_date);
    let date = new Date(data.trade_date).toLocaleDateString();

    return (
      <div className={classes.root}>
        <Card className={classes.card}>
          <form onSubmit={this.handleSubmit}>
            <CardContent>
              <Typography component="h3">
                <div>Trade id: {data.id}</div>
                <div>Trade date: {date}</div>
                <div>Trade time: {data.trade_time}</div>
                <div>Client buy: {data.b_client}</div>
                <div>Account buy: {data.b_account}</div>
                <div>Trader buy: {data.b_trader}</div>
                <div>Comms buy: {data.b_commission}</div>
                <br />
                <div>Client sell: {data.s_client}</div>
                <div>Account sell: {data.s_account}</div>
                <div>Trader sell: {data.s_trader}</div>
                <div>Comms sell: {data.s_commission}</div>
                <br />
                <div>Contract: {data.contract}</div>
                <div>Price: {data.price}</div>
                <div>Strike: {data.strike}</div>
                <div>Instrument: {data.instrument}</div>
                <div>Quantity: {data.qty}</div>

                <div>
                  {/* <label>Deal id:</label> */}
                  {/* <input
                    type="number"
                    name="dealid"
                    value={this.state.dealid}
                    onChange={this.handleChange}
                  /> */}
                  <TextField
                    error
                    type="number"
                    name="dealid"
                    label="Deal id"
                    className={classes.textField}
                    value={this.state.dealid}
                    inputProps={{
                      style: { fontSize: 14, lineHeight: 1 },
                    }}
                    onChange={this.handleChange}
                    margin="normal"
                    variant="outlined"
                  />
                </div>
              </Typography>
            </CardContent>
            <CardActions>
              <Button color="primary" onClick={this.resendBuyer}>
                Resend Buyer
              </Button>
              <Button color="primary" onClick={this.resendSeller}>
                Resend Seller
              </Button>
              <Button onClick={this.return}>back</Button>
              <Button color="primary" type="submit">
                Submit
              </Button>
            </CardActions>
          </form>
        </Card>
      </div>
      //    <Paper className={classes.root}>
      //    <Table className={classes.table}>
      //      <TableHead>
      //        <TableRow>
      //          <TableCell>Trade_id</TableCell>
      //          <TableCell align="right">Trade_date</TableCell>
      //          <TableCell align="right">Trade_time</TableCell>
      //          <TableCell align="right">Client_buy</TableCell>
      //          <TableCell align="right">Account_buy</TableCell>
      //        </TableRow>
      //      </TableHead>
      //      <TableBody>
      //        {rows.map(row => (
      //          <TableRow key={row.id}>
      //            <TableCell component="th" scope="row">
      //              {row.name}
      //            </TableCell>
      //            <TableCell align="right">{row.calories}</TableCell>
      //            <TableCell align="right">{row.fat}</TableCell>
      //            <TableCell align="right">{row.carbs}</TableCell>
      //            <TableCell align="right">{row.protein}</TableCell>
      //          </TableRow>
      //        ))}
      //      </TableBody>
      //    </Table>
      //  </Paper>
    );
  }
}

Edit.propTypes = {
  classes: PropTypes.object.isRequired,
};

Edit.contextType = MyContext;

export default withStyles(styles)(Edit);
