const Config = require("../common/Config");
import { useSearchParams, useNavigate } from "react-router-dom";
import logo from "../assets/img/woobblr.png";
import CustomToast from "../components/toast/Toast";
import axios from "axios";
import { useEffect, useState } from "react";

const Payment = (props) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [displayToast, UsedisplayToast] = useState({ enable: false, message: "", status: "" });
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  let urlParams = {
    token: searchParams.get("token"),
    email: searchParams.get("email"),
    appid: searchParams.get("appid"),
    appname: searchParams.get("appname"),
    amount: searchParams.get("amount"),
    duration: searchParams.get("duration"),
    clientUrl: searchParams.get("clientUrl"),
  };

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay(order_id, amount) {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    var options = {
      key: "rzp_test_wt6RbeHEP9lvpC",
      amount: amount,
      currency: "INR",
      name: urlParams.appname,
      description: urlParams.appname,
      image: "https://woobblr.co.in/wp-content/uploads/2023/01/cropped-Woobblr_Logo.png",
      order_id: order_id,
      handler: function (response) {
        console.log(response);
        let params = {
          paymentID: response.razorpay_payment_id,
          razorpayOrderID: order_id,
        };
        console.log("Verify params=", params);
        params.token = urlParams.token;
        params.appid = urlParams.appid;
        params.razorPaySignature = response.razorpay_signature;
        verifyOrder(params);
      },

      notes: {
        description: `${urlParams.appname} App Developed By Woobblr`,
      },
      theme: {
        color: "#2300a3",
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  const verifyOrder = (params) => {
    axios({
      //   url: `${Config.apiBaseUrl}/subscription/verify`, //your url
      url: `http://localhost:3001/api/v1/subscription/verify`, //your url
      // url: "https://stupendous-coordinated-rotate.glitch.me/convert", //your url
      method: "POST",
      headers: {
        Authorization: params.token,
        appid: urlParams.appid,
        "x-razorpay-signature": params.razorPaySignature,
      },
      data: { razorpayOrderID: params.razorpayOrderID, paymentID: params.paymentID }, // important
    })
      .then((response) => {
        // handle susbcription data
        console.log("order => ", response);
        // alert(response);
        // window.location.reload(true);
        setPaymentSuccess(true);
        UsedisplayToast({ enable: true, message: "Successfully Bought Subscription, You Can Close This Page Now", status: "success" });
        window.location.href = `${urlParams.clientUrl}?paymentComplete=${true}`;

        //
      })
      .catch((err) => {
        console.log("errorpasdjmfp", err.response?.data?.message);
        alert(err.response?.data?.message);
        console.log(err);
      });
  };

  const newSubscription = () => {
    console.log("subs");
    {
      !paymentSuccess &&
        axios({
          //   url: `${Config.apiBaseUrl}/subscription`, //your url
          url: `http://localhost:3001/api/v1/subscription`, //your url
          // url: "https://stupendous-coordinated-rotate.glitch.me/convert", //your url
          method: "POST",
          headers: {
            Authorization: urlParams.token,
            appid: urlParams.appid,
          },
          data: { amount: urlParams.amount, subDuration: urlParams.duration }, // important
        })
          .then((response) => {
            // handle susbcription data
            console.log("order => ", response);
            displayRazorpay(response?.data?.data?.razorpayOrderID, urlParams.amount);
            //
          })
          .catch((err) => {
            console.log("errorpasdjmfp", err.response?.data?.message);
            // alert(err.response?.data?.message);
            if (err.response?.data?.message == "Payment Already Completed") window.location.href = `${urlParams.clientUrl}?paymentComplete=${true}`;
            console.log(err);
          });
    }
    //api call to new order,
    //function call to displayRazorpay from the response of that new order,
    //verifyorder function having api call to verify payment, refreshing the page to check subsription again
  };

  useEffect(() => {
    console.log("helo");
    newSubscription();
  }, []);

  return (
    <div>
      <h1></h1>
      {displayToast.enable && (
        <CustomToast message={displayToast.message} status={displayToast.status} UsedisplayToast={UsedisplayToast} toastClose={-1} />
      )}
    </div>
  );
};
export default Payment;
