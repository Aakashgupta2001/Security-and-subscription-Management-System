import { Fragment, useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";

import Button from "../components/button/Button";
import ErrorHandler from "../components/errorHandler/ErrorHandler";

const ResetPassword = (props) => {
  const { error, resetPassword, resetPasswordSuccess, setResetPasswordSuccess, isOpen, typeOf } = props;
  const pageActive = useRef(false);
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccessModal, setResetSuccessModal] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    if (resetPasswordSuccess) {
      setResetPasswordSuccess(false);
      setResetSuccessModal(true);
    }
  }, [resetPasswordSuccess]);

  const [states, setStates] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    newPassword: null,
    confirmPassword: null,
  });

  const togglePassword = (type) => {
    if (type === "new") {
      setShowNewPassword((prevState) => !prevState);
    } else {
      setShowConfirmPassword((prevState) => !prevState);
    }
  };

  const inputChange = (key, value) => {
    setStates({ ...states, [key]: value.target.value });
    setErrors({ ...errors, [key]: null });
  };

  const onClose = () => {
    window.opener = null;
    window.open("", "_self");
    window.close();
  };

  const formsubmit = (e) => {
    e.preventDefault();
    if (!states.newPassword) {
      newPasswordRef.current.focus();
      setErrors({ ...errors, newPassword: "Field required" });
      return;
    }

    if (!states.confirmPassword) {
      confirmPasswordRef.current.focus();
      setErrors({ ...errors, confirmPassword: "Field required" });
      return;
    }

    if (states.newPassword !== states.confirmPassword) {
      confirmPasswordRef.current.focus();
      setErrors({ ...errors, confirmPassword: "Passwords don't match" });
      return;
    }

    pageActive.current = true;

    let params = {
      token: searchParams.get("token"),
      email: searchParams.get("email"),
      appid: searchParams.get("appid"),
      password: states.confirmPassword,
    };
    resetPassword(params);
    console.log(states.newPassword);
    console.log(states.confirmPassword);
  };
  return (
    <Fragment>
      {isOpen && error && typeOf === "resetPassword" && <ErrorHandler errorMsg={error} />}
      {!resetSuccessModal && (
        <div className="flex items-center justify-center h-screen bg-cover bg-loginBack font-Poppins">
          <div className="container mx-auto w-fit px-5 py-10 shadow-lg rounded-md bg-white bg-opacity-80">
            <h1 className="font-bold text-2xl leading-loose text-center">Reset Password</h1>

            <form className="leading-relaxed">
              <label htmlFor="email" className="block text-gray-700 text-md font-semibold mt-2 ">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  className="inline-block text-sm shadow appearance-none border rounded-lg py-2 px-3 text-gray-700 mt-1 w-80 relative"
                  ref={newPasswordRef}
                  value={states.newPassword}
                  onChange={(val) => inputChange("newPassword", val)}
                ></input>
                <span className="absolute inset-y-0 right-2 pr-3 flex items-center text-gray-700 select-none" onClick={() => togglePassword("new")}>
                  <FontAwesomeIcon icon={showNewPassword ? faEye : faEyeSlash}></FontAwesomeIcon>
                </span>
              </div>

              <label htmlFor="email" className="block text-gray-700 text-md font-semibold mt-2 ">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  className="inline-block text-sm shadow appearance-none border rounded-lg py-2 px-3 text-gray-700 mt-1 w-80 relative"
                  ref={confirmPasswordRef}
                  value={states.confirmPassword}
                  onChange={(val) => inputChange("confirmPassword", val)}
                ></input>
                <span
                  className="absolute inset-y-0 right-2 pr-3 flex items-center text-gray-700 select-none"
                  onClick={() => togglePassword("confirm")}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash}></FontAwesomeIcon>
                </span>
              </div>

              {errors && (
                <span className="text-xs font-semibold text-red-600">{errors.newPassword ? errors.newPassword : errors.confirmPassword}</span>
              )}
              {error && pageActive.current && <span className="text-xs font-semibold text-red-600">{error}</span>}

              {/* <button
              onClick={formsubmit}
              className="bg-blue-100 hover:bg-blue-300 text-white  rounded mt-5 w-full"
            >
              Save
            </button> */}
              <div className="submit py-4">
                <Button onClick={formsubmit} buttonStyle="fill" width="w-full">
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* {resetSuccessModal && (
        <div className="h-full w-full absolute bg-blue z-50">
          <h1>Reset Password Susscessfull</h1>
        </div>
      )} */}
      <div className="w-full h-full flex justify-center align-middle">
        <Modal className="" isOpen={resetSuccessModal}>
          <ModalHeader className="flex justify-center " toggle={() => setResetSuccessModal((prevState) => !prevState)}>
            <span className="text-xl">Password Reset Succesfull!</span>
            <br></br>You can close this window now
          </ModalHeader>
          {console.log("modal", resetSuccessModal)}
          <ModalBody className="flex  flex-col items-center">
            <span className="text-7xl mb-4 text-green-600">
              <FontAwesomeIcon icon={faCheckCircle} />
            </span>
            <span onClick={onClose}>
              <Button buttonStyle="fill" width="w-fit text-sm" className="text-sm">
                click to close now
              </Button>
            </span>
          </ModalBody>
        </Modal>
      </div>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  isFetching: state.auth.isFetching,
  error: state.error.error,
  isOpen: state.error.isOpen,
  typeOf: state.error.typeOf,
  resetPasswordSuccess: state.auth.resetPasswordSuccess,
});

const mapDispatchToProps = (stateProps, dispatchProps, ownProps) => {
  const { dispatch } = dispatchProps;
  const { AuthActions } = require("../store/AuthRedux");
  return {
    ...stateProps,
    ...ownProps,
    resetPassword: (params) => {
      AuthActions.resetPassword(dispatch, params);
    },
    setResetPasswordSuccess: (params) => {
      AuthActions.setResetPasswordSuccess(dispatch, params);
    },
  };
};

export default connect(mapStateToProps, undefined, mapDispatchToProps)(ResetPassword);
