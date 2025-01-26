import axios from "axios";
const BASE_API_URL = process.env.REACT_APP_BACKEND_URL;

export default class ApiClient {
  constructor() {
    this.base_url = BASE_API_URL;
  }

  BaseURL() {
    return this.base_url;
  }

  isAuthenticated() {
    return localStorage.getItem("user") !== null;
  }

  authToken() {
    return localStorage.getItem("user");
  }

  authHeader() {
    // return auth header with jwt if user is logged in and request is to the api url
    const token = this.authToken();
    const isLoggedIn = !!token;
    return {
      headers: {
        Authorization: isLoggedIn ? `Bearer ${token}` : "",
      },
    };
  }

  async get(url, options = {}) {
    return axios
      .get(this.base_url + url, { ...this.authHeader(), ...options })
      .then((resp) => resp.data)
      .catch((err) => ({ error: err.response.data }));
  }

  async post(url, payload = {}, options = {}) {
    return axios
      .post(this.base_url + url, payload, { ...this.authHeader(), ...options })
      .then((resp) => resp.data)
      .catch((err) => ({ error: err.response.data }));
  }

  async put(url, payload = {}, options = {}) {
    return axios
      .put(this.base_url + url, payload, { ...this.authHeader(), ...options })
      .then((resp) => resp.data)
      .catch((err) => ({ error: err.response.data }));
  }

  async delete(url, options = {}) {
    return axios
      .delete(this.base_url + url, {
        ...this.authHeader(),
        ...options,
      })
      .then((resp) => resp.data)
      .catch((err) => ({ error: err.response.data }));
  }
}
