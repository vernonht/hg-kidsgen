import Vue from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
// const Cookie = process.client ? require('js-cookie') : undefined
const instance = axios.create({
  baseURL: 'https://backend.harvestgen.org/',
  // baseURL: location.host == 'kids.harvestgen.org' ? 'https://backend.harvestgen.org/' : 'http://hg-backend.test/',
  // baseURL: 'https://5ceb602d77d47900143b889c.mockapi.io/',
  headers: {'Authorization': 'Bearer ' + Cookies.get('token')}
})

instance.interceptors.request.use((config) => {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

instance.interceptors.response.use((response) => {
    // Do something with response data
    return response;
  }, function (error) {
    // Do something with response error
    if(error.response.status == 401) {
        Cookies.remove('token')
        // redirect('/login')
    }
    // console.log(error.response);

    return Promise.reject(error);
  });
Vue.prototype.$axios = instance
