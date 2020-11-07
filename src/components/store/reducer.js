import {
  FETCH_CLIENTS_BEGIN,
  FETCH_CLIENTS_SUCCESS,
  FETCH_CLIENTS_FAILURE,
  AUTH_STATUS,
  FETCH_PRODUCTS_SUCCESS,
} from "./actions";

const initialState = {
  clients: [],
  clientsObj: [],
  productsObj: [],
  loading: false,
  error: null,
  isAuth: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_CLIENTS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_CLIENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        clients: action.payload.clients,
        clientsObj: action.payload.clientsObj,
      };
    case FETCH_CLIENTS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        clients: [],
        clientsObj: [],
      };
    case AUTH_STATUS:
      console.log(action.payload);
      return {
        ...state,
        isAuth: action.payload,
      };
    case FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        productsObj: action.payload.productsObj,
      };
    default:
      return state;
  }
}
