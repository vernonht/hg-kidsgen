import Cookies from 'js-cookie';
export const state = () => ({
  key: ''
})

export const mutations = {
  add (state, text) {
    state.key = text
    Cookies.set('token', text);
  },
  remove (state) {
    state.key = ''
    Cookies.remove('token');
  },
}
