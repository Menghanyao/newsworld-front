import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    vuexUser: {
      // userId: '123',
      // userName: '测试哈',
      // userPhone: '',
      // userPassword: '',
      // userToken: '',
      // groupId: '',
      // userLevel: '',
      // gmtCreate: '',
      // gmtModified: '',
    }
  },
  mutations: {
    setVuexUser(state, user) {
      state.vuexUser = user
    }

  },
  actions: {
  },
  modules: {
  }
})
