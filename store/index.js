export const state = () => ({
  uid: '',
  major: '',
});

export const getters = {
  uid(state) {
    return state.uid;
  },
  major(state) {
    return state.major;
  },
};

export const mutations = {
  getUid(state, payload) {
    state.uid = payload.uid;
  },
  getMajor(state, payload) {
    state.major = payload.major;
  },
};
