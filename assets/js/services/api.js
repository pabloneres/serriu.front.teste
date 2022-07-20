import axios from "axios";

const api = axios.create({
  //baseURL: 'http://serriu-back.herokuapp.com'
  // baseURL: "http://127.0.0.1:3333"
  // baseURL: "https://apidevelop.serriu.com.br"
  // baseURL: "https://api.serriu.com.br"
  baseURL: process.env.REACT_APP_API_URL
});

export default api;
