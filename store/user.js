export const state = () => ({
  details: {},
  asseturl: location.host == 'kids.harvestgen.org' ? 'https://backend.harvestgen.org/public/' : 'http://hg-backend.test/',
})

export const mutations = {
  add (state, text) {
    state.details = text
  },
  remove (state) {
    state.details = {}
  },
}
