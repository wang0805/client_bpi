export function fetchClients() {
  return (dispatch) => {
    dispatch(fetchClientsBegin());
    return fetch("/api/clients", {
      method: "GET",
      headers: { Authorization: localStorage.getItem("token") },
    })
      .then(handleErrors)
      .then((res) => res.json())
      .then((data) => {
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
          let commission_lpf = 0;
          let commission_acf = 0;
          let commission_m42f = 0;
          let commission_rb = 0;
          let commission_ncf = 0;
          let commission_st = 0;
          let commission_sc = 0;
          let idb = "";
          let id = "";
          let entity = "";
          let in_sg = 0;
          let duedate = 14;
          let deduct_broker_comms = "";

          for (let j = 0; j < data.length; j++) {
            if (data[j].client_name === clients[i]) {
              address = data[j].address;
              id = data[j].id;
              traders.push(data[j].trader_name);
              accounts.push(data[j].account);
              recap_emails = data[j].recap_emails;
              invoice_emails = data[j].invoice_emails;
              commission = data[j].commission;
              commission_lpf = data[j].commission_lpf;
              commission_acf = data[j].commission_acf;
              commission_m42f = data[j].commission_m42f;
              commission_rb = data[j].commission_rb;
              commission_ncf = data[j].commission_ncf;
              commission_st = data[j].commission_st;
              commission_sc = data[j].commission_sc;
              idb = data[j].idb;
              entity = data[j].entity;
              in_sg = data[j].in_sg;
              duedate = data[j].duedate;
              deduct_broker_comms = data[j].deduct_broker_comms;
            }
          }
          clientsObj.push({
            clients: clients[i],
            address: address,
            accounts: [...new Set(accounts)],
            traders: [...new Set(traders)],
            commission: commission,
            commission_lpf: commission_lpf,
            commission_acf: commission_acf,
            commission_m42f: commission_m42f,
            commission_rb: commission_rb,
            commission_ncf: commission_ncf,
            commission_st: commission_st,
            commission_sc: commission_sc,
            recap_emails: recap_emails,
            invoice_emails: invoice_emails,
            idb: idb,
            id: id,
            entity: entity,
            in_sg: in_sg,
            duedate: duedate,
            deduct_broker_comms: deduct_broker_comms,
          });
        }
        dispatch(
          fetchClientsSuccess({ clients: clients, clientsObj: clientsObj })
        );
        return {
          clients: clients,
          clientsObj: clientsObj,
        };
      })
      .catch((error) => dispatch(fetchClientsFailure(error)));
  };
}

export function fetchProducts() {
  return (dispatch) => {
    return fetch("/api/products")
      .then(handleErrors)
      .then((res) => res.json())
      .then((data) => {
        let productsObj = data;
        dispatch(fetchProductsSuccess({ productsObj: productsObj }));
        return {
          productsObj: productsObj,
        };
      })
      .catch((error) => console.log(error, "fetchproduct error"));
  };
}

function handleErrors(res) {
  if (!res.ok) {
    throw Error(res.statusText);
  }
  return res;
}

export function authUsers(status) {
  return (dispatch) => {
    dispatch(authStatus(status));
    return {
      status: status,
    };
  };
}

export const FETCH_CLIENTS_BEGIN = "FETCH_CLIENTS_BEGIN";

export const FETCH_CLIENTS_SUCCESS = "FETCH_CLIENTS_SUCCESS";

export const FETCH_CLIENTS_FAILURE = "FETCH_CLIENTS_FAILURE";

export const AUTH_STATUS = "AUTH_STATUS";

export const FETCH_PRODUCTS_SUCCESS = "FETCH_PRODUCTS_SUCCESS";

export const fetchClientsBegin = () => ({
  type: FETCH_CLIENTS_BEGIN,
});

export const fetchClientsSuccess = (clients) => ({
  type: FETCH_CLIENTS_SUCCESS,
  payload: clients,
});

export const fetchClientsFailure = (error) => ({
  type: FETCH_CLIENTS_FAILURE,
  payload: { error },
});

export const authStatus = (status) => ({
  type: AUTH_STATUS,
  payload: status,
});

export const fetchProductsSuccess = (products) => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: products,
});
