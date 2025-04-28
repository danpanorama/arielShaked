


import axios from "axios";
import { useNavigate } from "react-router-dom"; // אם אתה בפרונט ריאקט

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // כתובת ה-API שלך
  withCredentials: true,
});

// Interceptor של תגובות
// axiosInstance.interceptors.response.use(
//   (response) => {
//     // אם הכל תקין פשוט תחזיר
//     return response;
//   },
//   (error) => {
//     // אם יש שגיאה
//     if (error.response && error.response.status === 401) {
//       ('hararararar')
//       // אם אין הרשאה
//       window.location.href = "/"; // או "/login" - תלוי לאן אתה רוצה להעיף
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
