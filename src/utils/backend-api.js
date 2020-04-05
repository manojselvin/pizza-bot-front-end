import axios from "axios";
const env = process.env.NODE_ENV || "development";

if (env == 'production') {
	var BASE_URL = "https://pizza-bot-yellow-messenger.herokuapp.com/api/";
	
} else {
	BASE_URL = "http://localhost:3000/api/";
}

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: false,
  params: {}
});

instance.interceptors.request.use(
  function(config) {
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => response,
  error => {
    console.log(error.config);
    return Promise.reject(error);
  }
);

export default {
  getData(action) {
    let url =`${BASE_URL}`;
    return instance.get(url+action);
  },
  postData(action, data) {
    console.log(data);

    let url = `${BASE_URL}`;
    // url += action;
    return instance.post(url+action, data);
  },
  putData(action, data) {
    let url = `${BASE_URL}`;
    // url += action;
    return instance.put(url+action, data);
  },
  deleteData(action) {
    let url = `${BASE_URL}`;
    // url += action;
    return instance.delete(url+action);
  },
};
