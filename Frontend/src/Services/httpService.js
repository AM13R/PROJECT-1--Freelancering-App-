import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const app = axios.create({
   baseURL: BASE_URL,
   withCredentials: true,
});

app.interceptors.request.use(
   (res) => res,
   (err) => Promise.reject(err)
)

app.interceptors.response.use(
  (res) => res,
  (err) => {
    const originalConfig = err.config;
		if (err.response.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
			try {
        const {data} = axios.get(`${BASE_URL}/user/refresh-token` , {
         withCredentials: true
        });
        if (data) app(originalConfig);
      
      } catch (error) {
        Promise.reject(err);
      }
		}
    Promise.reject(err)
  }
)

 
const http = {
   get: app.get,
   post: app.post,
   delete: app.delete,
   put: app.put,
   patch: app.patch,
}

export default http;