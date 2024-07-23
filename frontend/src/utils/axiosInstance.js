import axios from "axios";

// const apiUrl = import.meta.env.VITE_API_URL;

// const url = "https://blog-app-backend-k54u.onrender.com";

// console.log("API URL:", apiUrl); 

const axiosInstance = axios.create({ baseURL: "http://localhost:8000/api/v1" });

axiosInstance.interceptors.request.use((req) => {
  const stringifyBlogData = window.localStorage.getItem("blogData");

  if (stringifyBlogData) {
    const blogData = JSON.parse(stringifyBlogData);
    const token = blogData.token;

    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const event = new CustomEvent('tokenExpired');
      window.dispatchEvent(event);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;