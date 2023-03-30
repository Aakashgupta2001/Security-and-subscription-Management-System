// const axios = require("axios");
import axios from "axios";
class ApiClient {
  baseUrl;

  constructor(options) {
    this.baseUrl = options.baseUrl;
  }
  post(endpoint, params, headers = null) {
    return this.requestHttp("post", this.baseUrl + endpoint, params, headers);
  }

  get(endpoint, params, headers = null) {
    return this.requestHttp("GET", this.baseUrl + endpoint, null, headers);
  }

  put(endpoint, params, headers = null) {
    return this.requestHttp("PUT", this.baseUrl + endpoint, params, headers);
  }

  patch(endpoint, params, headers = null) {
    return this.requestHttp("PATCH", this.baseUrl + endpoint, params, headers);
  }

  delete(endpoint, params, headers = null) {
    return this.requestHttp("DELETE", this.baseUrl + endpoint, params, headers);
  }

  requestHttp(method, url, params, headers) {
    return new Promise((resolve, reject) => {
      const options = {
        method,
        url: url,
        headers: {
          "Content-Type": "application/json",
          appid: params.appid,
        },
      };
      if (params) {
        options.data = JSON.stringify(params);
      }
      if (headers && headers.token) {
        options.headers.Authorization = `${headers.token}`;
      }
      if (headers && headers.signature) {
        options.headers["x-razorpay-signature"] = `${headers.signature}`;
      }
      axios(options)
        .then((response) => {
          resolve({ statusCode: response.status, body: response.data });
        })
        .catch((error) => {
          if (error.response) {
            // Request made and server responded
            console.log(error.response);
            reject({ error: true, message: error.response?.data?.message });
          } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
            reject({ error: true, message: error.request });
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
            reject({ error: true, message: error.message });
          }
        });
    });
  }
}

export default ApiClient;
