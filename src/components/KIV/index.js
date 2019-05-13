const express = require("express");
const http = require("http");
const db = require("./db");
const bodyParser = require("body-parser");

const previewEmail = require("preview-email");
const Email = require("email-templates");
const nodemailer = require("nodemailer");
require("dotenv").config();

/**
 * ===================================
 * nodemailer set up
 * ===================================
 */
var transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false, //true for 465 and false for other ports, gmail SSL 465 / TLS 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: { rejectUnauthorized: false }
});

const email = new Email({
  message: {
    from: '"futuresops" <whwang@bpifinancial.com>'
  },
  send: true,
  transport: transporter
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

// Set up middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(guard.check("user"));

//import routes calling on db
require("./routes")(app, db);

// Root GET request (it doesn't belong in any controller file)
app.get("/", (req, res) => {
  res.json([{ TEST: "TESTING ROUTES" }]);
});

app.post("/send", (req, res) => {
  // console.log(req.body, "req body from /send");
  // buyer
  let size = 0;
  if (req.body.instrument === "S") {
    size = req.body.qty * 500;
  } else {
    size = req.body.qty * 100;
  }
  let content_b = req.body.b_client;

  console.log(__dirname, "dirname");

  let mailOptions = {
    from: "whwang@bpifinancial.com",
    to: req.body.b_recap,
    subject: "test attachments",
    html: `
    <p>${req.body.b_client}</p>
    <p>${req.body.b_accounts}</p>
    <br/>
    <p>${req.body.b_trader}</p>
    `,
    attachments: [
      {
        filename: "something.pdf",
        path: __dirname + "/ndfs.pdf",
        contentType: "application/pdf"
      }
    ]
  };

  previewEmail(mailOptions)
    .then(console.log)
    .catch(console.error);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  });

  email
    .send({
      template: "buyer",
      message: {
        to: req.body.b_recap
      },
      attachments: [
        {
          filename: "something.txt",
          path: __dirname + "/something.txt"
        }
      ],
      locals: {
        buyer: req.body.b_client,
        date: req.body.execDate,
        product_code: req.body.product_code,
        contract: req.body.contract,
        price: req.body.price,
        strike: req.body.strike,
        instrument: req.body.instrument,
        qty: req.body.qty,
        size: size,
        trader: req.body.b_trader,
        account: req.body.b_accounts,
        commission: req.body.b_comms
      }
    })
    .then(console.log("success for buyer"))
    .catch(console.error);
  // seller
  email
    .send({
      template: "seller",
      message: {
        to: req.body.s_recap
      },
      attachments: [
        {
          filename: "seller.txt",
          content: req.body.s_client
        }
      ],
      locals: {
        seller: req.body.s_client,
        date: req.body.execDate,
        product_code: req.body.product_code,
        contract: req.body.contract,
        price: req.body.price,
        strike: req.body.strike,
        instrument: req.body.instrument,
        qty: req.body.qty,
        size: size,
        trader: req.body.s_trader,
        account: req.body.s_accounts,
        commission: req.body.s_comms
      }
    })
    .then(console.log("success for seller"))
    .catch(console.error);
  res.send("success in sending mail");
});

/**
 * ===================================
 * Listen to requests on port 3001
 * ===================================
 */
const PORT = process.env.PORT || 3001;

const server = http.Server(app);

server.listen(PORT, () =>
  console.log("~~~ Tuning in to the waves of port " + PORT + " ~~~")
);

// Run clean up actions when server shuts down
server.on("close", () => {
  console.log("Closed express server");

  db.pool.end(() => {
    console.log("Shut down db connection pool");
  });
});
