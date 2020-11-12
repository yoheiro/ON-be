export const state = () => ({
  uid: '',
});

export const getters = {
  uid(state) {
    return state.uid;
  },
};

export const mutations = {
  getUid(state, payload) {
    state.uid = payload.uid;
  },
};
