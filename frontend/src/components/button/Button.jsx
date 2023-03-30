import React, { Fragment } from "react";

const Button = (props) => {
  return (
    <Fragment>
      {props.buttonStyle === "fill" ? (
        <button onClick={props.onClick ? props.onClick : () => {}} className={`bg-blue-100 hover:bg-blue-300 text-white py-2 px-3 rounded  ${props.width}`}>
          {props.children}
        </button>
      ) : (
        <button onClick={props.onClick ? props.onClick : () => {}} className={`text-blue-100 py-2 px-3 rounded  ${props.width}`}>
          {props.children}
        </button>
      )}
    </Fragment>
  );
};

export default Button;
