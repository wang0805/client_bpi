import {
  FETCH_CLIENTS_BEGIN,
  FETCH_CLIENTS_SUCCESS,
  FETCH_CLIENTS_FAILURE,
  AUTH_STATUS,
} from "./actions";

const initialState = {
  clients: [],
  clientsObj: [],
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
    default:
      return state;
  }
}
