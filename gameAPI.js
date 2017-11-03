import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:3000",
  baseURL: "https://blooming-gorge-29499.herokuapp.com/",
  headers: {
    Accept: "applicaton/json",
    "Content-Type": "application/json"
  }
});

export default axiosInstance;
