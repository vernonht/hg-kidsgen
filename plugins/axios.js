export default function ({ $axios, redirect }) {
  const Cookie = require('js-cookie')
  // const instance = $axios.create({
  //   baseURL: process.env.API,
  //   headers: { 'Authorization': 'Bearer ' + Cookie.get('accessToken') }
  // })
  $axios.setBaseURL(location.host == 'kids.harvestgen.org' ? 'https://backend.harvestgen.org/' : 'http://hg-backend.test/')
  $axios.setHeader('Authorization', 'Bearer ' + Cookie.get('token'))

  $axios.onRequest((config) => {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  $axios.onResponse((response) => {
    // Do something with response data
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });

  $axios.onResponseError((err) => {
    // Do something with err data
    if (err.response.data.code == 401) {
        Cookies.remove('token')
    }
    return Promise.reject(err);
  }, function (error) {
    // Do something with err error
    return Promise.reject(error);
  });

  // inject('axios', instance)
}
