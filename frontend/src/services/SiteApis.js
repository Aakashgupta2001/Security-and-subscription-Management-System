import Config from "../common/Config";
import ApiClient from "./apiClient";

const Api = new ApiClient({
  baseUrl: Config.apiBaseUrl,
});

const SiteApis = {
  apiPostCall: async (api, params, token, signature = null) => {
    try {
      const response = await Api.post(api, params, { token, signature });
      if (response.statusCode === 200) {
        return response.body;
      } else {
        throw response.body;
      }
    } catch (err) {
      return err;
    }
  },
  apiDeleteCall: async (api, params, token) => {
    try {
      const response = await Api.delete(api, params, { token });
      if (response.statusCode === 200) {
        return response.body;
      } else {
        throw response.body;
      }
    } catch (err) {
      return err;
    }
  },
  apiPutCall: async (api, params, token) => {
    try {
      const response = await Api.put(api, params, { token });
      if (response.statusCode === 200) {
        return response.body;
      } else {
        throw response.body;
      }
    } catch (err) {
      return err;
    }
  },
  apiGetCall: async (api, params, token) => {
    try {
      const response = await Api.get(api, params, { token });
      if (response.statusCode === 200) {
        return response.body;
      } else {
        throw response.body;
      }
    } catch (err) {
      return err;
    }
  },
};

export default SiteApis;
