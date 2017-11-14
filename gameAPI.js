import axios from "axios";

let serverURL;

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  serverURL = "http://localhost:3000";
} else {
  serverURL = "https://blooming-gorge-29499.herokuapp.com/";
}

const axiosInstance = axios.create({
  baseURL: serverURL,
  headers: {
    Accept: "applicaton/json",
    "Content-Type": "application/json"
  }
});

export default axiosInstance;
