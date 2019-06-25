import Vue from 'vue';
import axios from 'axios';

// const Cookie = process.client ? require('js-cookie') : undefined
const instance = axios.create({
  baseURL: 'http://hg-backend.test/',
  // baseURL: 'https://5ceb602d77d47900143b889c.mockapi.io/',
  // headers: {'Authorization': 'Bearer ' + Cookie.get('accessToken')}
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
    // if(error.response.data.code == 401) {
    //     redirect('/login')
    // }
    // console.log(error.response);
    return Promise.reject(error);
  });
Vue.prototype.$axios = instance
