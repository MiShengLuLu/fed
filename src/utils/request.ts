import axios from 'axios'
import store from '@/store'
import { message } from 'ant-design-vue'
import router from '@/router'
import qs from 'qs'

const request = axios.create({
  // 配置选项
})

// Add a request interceptor
request.interceptors.request.use(function (config) {
  // Do something before request is sent
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

let isRefreshing = false
let requests: any[] = []
// Add a response interceptor
request.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, async function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  // console.dir(error)
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { status } = error.response
    switch (status) {
      case 400:
        message.error('请求参数错误')
        break
      case 401:
        if (!store.state.user) {
          redirectLogin()
          return Promise.reject(error)
        }
        if (!isRefreshing) {
          isRefreshing = true
          // 尝试刷新 token
          return refreshToken()
            .then(res => {
              if (!res.data.success) {
                throw new Error('刷新 Token 失败')
              }
              // 更新用户信息
              store.commit('UPDATE_USER', res.data.content)
              // 失败请求的配置信息
              // console.log(error.config)
              // 将 requests 队列中的请求重新发出去
              requests.forEach(fn => fn())
              // 重置 requests 队列数据
              requests = []
              // 将本次失败的请求重新发出去
              return request(error.config)
            })
            .catch(() => {
              // 清除当前用户信息
              store.commit('UPDATE_USER', null)

              redirectLogin()
              return Promise.reject(error)
            })
            .finally(() => {
              isRefreshing = false// 重置刷新状态
            })
        }

        // 刷新状态下，把请求挂起添加到 requests 队列中
        return new Promise(resolve => {
          requests.push(() => resolve(request(error.config)))
        })
        // try {
        //   const { data } = await axios.create()({
        //     method: 'post',
        //     url: '/front/user/refresh_token',
        //     data: qs.stringify({
        //       refreshtoken: store.state.user.refresh_token
        //     })
        //   })
        //   store.commit('UPDATE_USER', data.content)
        //   console.log(error.config)// 失败请求的配置信息
        //   return request(error.config)
        // } catch (error) {
        //   store.commit('UPDATE_USER', null)
        //   redirectLogin()
        //   return Promise.reject(error)
        // }
      case 403:
        message.warning('没有权限，请联系管理员')
        break
      case 404:
        message.error('访问资源不存在')
        break
      default:
        message.error('服务端资源错误，请联系管理员')
        break
    }
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    message.error('请求超时，请刷新重试')
  } else {
    // Something happened in setting up the request that triggered an Error
    message.error(`请求失败${error.message}`)
  }
  return Promise.reject(error)
})

const redirectLogin = () => {
  router.push({
    name: 'login',
    query: {
      redirect: router.currentRoute.value.fullPath
    }
  })
}

const refreshToken = () => {
  return axios.create()({
    method: 'post',
    url: '/front/user/refresh_token',
    data: qs.stringify({
      refreshtoken: store.state.user.refresh_token
    })
  })
}

export default request
