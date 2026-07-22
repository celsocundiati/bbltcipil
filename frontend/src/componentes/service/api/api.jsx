
import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8000/api",
//   timeout: 10000,
//   withCredentials: true,
// });

const API_URL = import.meta.env.VITE_API_URL;

console.log("API_URL =", API_URL);
console.log("BASE_URL =", `${API_URL}/api`);

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  console.log("BASE URL:", config.baseURL);
  console.log("URL:", config.url);
  console.log("FINAL:", `${config.baseURL}${config.url}`);

  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Se já estiver fazendo refresh, coloca na fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // try {
      //   const res = await axios.post(
      //     "http://localhost:8000/api/accounts/refresh/",
      //     {},
      //     { withCredentials: true }
      //   );

        
        try {

          const res = await api.post("/accounts/refresh/");

          // const res = await axios.post(
          //   `${API_URL}/api/accounts/refresh/`,
          //   {},
          //   {
          //     withCredentials: true
          //   }
          // );

        const newAccessToken = res.data.access;

        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        return api(originalRequest); // repete o request original
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;


// import axios from "axios";

// const API_URL = import.meta.env.VITE_API_URL;

// console.log("API_URL =", API_URL);
// console.log("BASE_URL =", `${API_URL}/api`);

// const api = axios.create({
//   baseURL: `${API_URL}/api`,
//   timeout: 10000,
//   withCredentials: true,
// });

// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach(prom => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });

//   failedQueue = [];
// };


// api.interceptors.response.use(
//   response => response,

//   async error => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {

//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//         .then(token => {
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           return api(originalRequest);
//         })
//         .catch(err => Promise.reject(err));
//       }


//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {

//         const res = await axios.post(
//           `${API_URL}/api/accounts/refresh/`,
//           {},
//           {
//             withCredentials: true
//           }
//         );


//         const newAccessToken = res.data.access;


//         api.defaults.headers.common.Authorization =
//           `Bearer ${newAccessToken}`;


//         processQueue(null, newAccessToken);


//         return api(originalRequest);


//       } catch (err) {

//         processQueue(err, null);
//         return Promise.reject(err);

//       } finally {

//         isRefreshing = false;

//       }
//     }

//     return Promise.reject(error);
//   }
// );


// export default api;