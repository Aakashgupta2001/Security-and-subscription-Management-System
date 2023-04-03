import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ResetPassword, Payment, AboutUs, ContactUs, Home, PrivacyPolicy, RefundPolicy, TermsOfService } from "../pages";
import { connect } from "react-redux";

const Routers = (props) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/resetPassword/*" element={<ResetPassword />}></Route>
        <Route path="/Payment/*" element={<Payment />}></Route>
        <Route path="*" element={<Home />}></Route>
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />}></Route>
        <Route path="/RefundPolicy" element={<RefundPolicy />}></Route>
        <Route path="/TermsOfService" element={<TermsOfService />}></Route>
        <Route path="/ContactUs" element={<ContactUs />}></Route>
        <Route path="/AboutUs" element={<AboutUs />}></Route>
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
