import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

const API = axios.create({
  baseURL: `${BASE_URL}/api`, // change when deploying
});

export default API;
