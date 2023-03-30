import { Fragment } from "react";
import Routers from "./navigation/Routers";
import "./App.css";
import reducers from "./store";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { createStore, compose, applyMiddleware } from "redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/es/integration/react";

function App() {
  let store = null;
  const middleware = [thunk];
  store = compose(applyMiddleware(...middleware))(createStore)(
    reducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
  let persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Routers />
      </PersistGate>
    </Provider>
  );
}

export default App;
