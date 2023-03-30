import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ResetPassword } from "../pages";
import { connect } from "react-redux";

const Routers = (props) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/resetPassword/*" element={<ResetPassword />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

const mapStateToProps = (state) => ({
  token: state.auth.token,
  isFetching: state.auth.isFetching,
  isOptSend: state.auth.isOptSend,
  user: state.auth.user,
});

export default connect(mapStateToProps)(Routers);
