export const state = () => ({
  key: ''
})

export const mutations = {
  add (state, text) {
    state.key = text
  },
  remove (state, { todo }) {
    state.key = ''
  },
}
