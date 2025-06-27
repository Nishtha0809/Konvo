// import axios from "axios";

// export const axiosInstance = axios.create({
//     baseURL: "http://localhost:5001/api",
//     withCredentials: true,
// })
// src/lib/axios.js
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api", // match .env PORT
  withCredentials: true, // must for cookies
});
