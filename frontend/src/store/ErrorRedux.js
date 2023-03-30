const types = {
  SET_ERROR: "SET_ERROR",

  HIDE_ERROR: "HIDE_ERROR",
};

export const ErrorActions = {
  setError: async (dispatch, error, typeOf) => {
    console.log("errorRedux=", error);
    dispatch({ type: types.SET_ERROR, error: error, typeOf: typeOf });
  },
  hideError: async (dispatch) => {
    dispatch({ type: types.HIDE_ERROR });
  },
};

const initialState = {
  error: null,
  isOpen: false,
  typeOf: "",
};

export const reducer = (state = initialState, action) => {
  const { type, error, typeOf } = action;
  switch (type) {
    case types.SET_ERROR: {
      return {
        ...state,
        error: error,
        isOpen: true,
        typeOf: typeOf,
      };
    }
    case types.HIDE_ERROR: {
      return {
        ...state,
        error: null,
        isOpen: false,
        typeOf: "",
      };
    }

    default:
      return state;
  }
};
