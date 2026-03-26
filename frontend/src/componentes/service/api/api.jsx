// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8000/api",
//   timeout: 10000,
//   withCredentials: true, // essencial para cookies HttpOnly
// });

// // Interceptor para refresh automático
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;
//       try {
//         const res = await axios.post(
//           "http://localhost:8000/api/accounts/refresh/",
//           {},
//           { withCredentials: true }
//         );
//         const access = res.data.access;
//         originalRequest.headers.Authorization = `Bearer ${access}`;
//         return api(originalRequest);
//       } catch (err) {
//         console.log("Refresh falhou", err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;


import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
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

      try {
        const res = await axios.post(
          "http://localhost:8000/api/accounts/refresh/",
          {},
          { withCredentials: true }
        );

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