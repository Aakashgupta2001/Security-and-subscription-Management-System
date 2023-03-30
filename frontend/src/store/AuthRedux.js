import SiteAPI from "../services/SiteApis";
import { ErrorActions } from "./ErrorRedux";

const types = {
  FETCH_SIGNUP_PENDING: "FETCH_SIGNUP_PENDING",
  FETCH_SIGNUP_SUCCESS: "FETCH_SIGNUP_SUCCESS",
  FETCH_SIGNUP_FAILURE: "FETCH_SIGNUP_FAILURE",

  FETCH_LOGIN_PENDING: "FETCH_LOGIN_PENDING",
  FETCH_LOGIN_SUCCESS: "FETCH_LOGIN_SUCCESS",
  FETCH_LOGIN_FAILURE: "FETCH_LOGIN_FAILURE",

  SET_SIGNED_IN: "SET_SIGNED_IN",

  FORGOT_PASSWORD_PENDING: "FORGOT_PASSWORD_PENDING",
  FORGOT_PASSWORD_SUCCESS: "FORGOT_PASSWORD_SUCCESSS",
  FORGOT_PASSWORD_FAILURE: "FORGOT_PASSSWORD_FAILURE",

  RESET_PASSWORD_PENDING: "RESET_PASSWORD_PENDING",
  RESET_PASSWORD_SUCCESS: "RESET_PASSWORD_SUCCESS",
  RESET_PASSWORD_FAILURE: "RESET_PASSWORD_FAILURE",

  SET_RESETPASSWORD_SUCCESS: "SET_RESETPASSWORD_SUCCESS",

  LOGOUT: "LOGOUT",
};

export const AuthActions = {
  login: async (dispatch, params, token) => {
    dispatch({ type: types.FETCH_LOGIN_PENDING });
    let data = await SiteAPI.apiPostCall("/user/login", params, token);
    if (data.error) {
      // alert(data.message);
      ErrorActions.setError(dispatch, data.message, "login");
      dispatch({ type: types.FETCH_LOGIN_FAILURE, error: data.message });
    } else {
      console.log("USER=", data.data);
      dispatch({
        type: types.FETCH_LOGIN_SUCCESS,
        user: data.data,
        token: data.data.token,
      });
    }
  },
  signUp: async (dispatch, params) => {
    dispatch({ type: types.FETCH_SIGNUP_PENDING });
    let data = await SiteAPI.apiPostCall("/user/signup", params);
    if (data.error) {
      // alert(data.message);
      ErrorActions.setError(dispatch, data.message, "signup");
      dispatch({ type: types.FETCH_SIGNUP_FAILURE, error: data.message });
    } else {
      dispatch({ type: types.FETCH_SIGNUP_SUCCESS });
    }
  },
  setSignedIn: async (dispatch) => {
    dispatch({ type: types.SET_SIGNED_IN });
  },
  forgotPassword: async (dispatch, params) => {
    dispatch({ type: types.FORGOT_PASSWORD_PENDING });
    let data = await SiteAPI.apiPostCall("/user/password/forgot", params);
    if (data.error) {
      // alert(data.message);
      ErrorActions.setError(dispatch, data.message, "forgotPassword");
      dispatch({ type: types.FORGOT_PASSWORD_FAILURE, error: data.message });
    } else {
      dispatch({ type: types.FORGOT_PASSWORD_SUCCESS });
    }
  },
  resetPassword: async (dispatch, params) => {
    console.log("HERE");
    dispatch({ type: types.RESET_PASSWORD_PENDING });
    let data = await SiteAPI.apiPostCall("/user/password/reset", params);
    if (data.error) {
      // alert(data.message);
      ErrorActions.setError(dispatch, data.message, "resetPassword");
      dispatch({ type: types.RESET_PASSWORD_FAILURE, error: data.message });
    } else {
      dispatch({ type: types.RESET_PASSWORD_SUCCESS });
    }
  },

  setResetPasswordSuccess: async (dispatch, params) => {
    dispatch({
      type: types.SET_RESETPASSWORD_SUCCESS,
      resetPasswordSuccess: params,
    });
  },
  logout() {
    return { type: types.LOGOUT };
  },
};

const initialState = {
  isFetching: false,
  error: null,
  isSignup: false,
  user: null,
  token: null,
  resetPasswordSuccess: false,
};

export const reducer = (state = initialState, action) => {
  const { type, error, user, token, resetPasswordSuccess } = action;
  switch (type) {
    case types.FETCH_SIGNUP_PENDING:
    case types.FETCH_LOGIN_PENDING:
    case types.FORGOT_PASSWORD_PENDING:
    case types.RESET_PASSWORD_PENDING: {
      return {
        ...state,
        isFetching: true,
        isSignup: false,
        error: null,
      };
    }
    case types.FETCH_SIGNUP_FAILURE:
    case types.FETCH_LOGIN_FAILURE:
    case types.FORGOT_PASSWORD_FAILURE:
    case types.RESET_PASSWORD_FAILURE: {
      return {
        ...state,
        isFetching: false,
        error,
      };
    }
    case types.FETCH_SIGNUP_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        error: null,
        isSignup: true,
      };
    }
    case types.FETCH_LOGIN_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        error: null,
        user,
        token,
      };
    }

    case types.SET_SIGNED_IN: {
      return {
        ...state,
        isSignup: false,
      };
    }

    case types.FORGOT_PASSWORD_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        error: null,
      };
    }
    case types.RESET_PASSWORD_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        error: null,
        resetPasswordSuccess: true,
      };
    }

    case types.SET_RESETPASSWORD_SUCCESS: {
      return {
        ...state,
        resetPasswordSuccess,
      };
    }

    case types.LOGOUT:
      return Object.assign({}, initialState);
    default:
      return state;
  }
};
