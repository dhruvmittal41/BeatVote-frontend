import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5055/api', // change when deploying
});

export default API;
