import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: "http://localhost:3030/",
 
// });

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, 
});
 
export default axiosInstance;