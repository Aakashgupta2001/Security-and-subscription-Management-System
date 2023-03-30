import { persistCombineReducers } from "redux-persist";
import storage from "redux-persist/es/storage";
import { reducer as AuthRedux } from "./AuthRedux";
import { reducer as ErrorRedux } from "./ErrorRedux";

const config = {
  key: "root",
  storage,
  blacklist: [],
};
export default persistCombineReducers(config, {
  auth: AuthRedux,

  error: ErrorRedux,
});
