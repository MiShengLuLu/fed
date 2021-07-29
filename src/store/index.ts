import { createStore } from 'vuex'

export default createStore({
  // 容器状态实现了数据共享，在组件中可以被访问，但是没有实现数据持久化功能
  state: {
    user: JSON.parse(localStorage.getItem('USER') || 'null')// 当前用户登陆状态
  },
  mutations: {
    UPDATE_USER (state, payload) {
      state.user = JSON.parse(payload)

      localStorage.setItem('USER', payload)
    }
  },
  actions: {
  },
  modules: {
  }
})
