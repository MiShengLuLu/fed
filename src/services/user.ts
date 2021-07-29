import request from '@/utils/request'
import qs from 'qs'

interface User {
  phone: string
  password: string
}

// 登陆
export const login = (data: User) => {
  return request({
    method: 'post',
    url: '/front/user/login',
    // headers: { 'content-type': 'application/x-www-form-urlencoded' },
    // 如果 data 是普通对象，Content-Type 是 application/json
    // 如果 data 是 qs.stringify(data) 转换之后的数据：key=value&key=value，Content-Type 是 application/x-www-form-urlencoded
    // 如果 data 是 FormData 对象，Content-Type 是
    data: qs.stringify(data)
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return request({
    method: 'get',
    url: '/front/user/getInfo'
  })
}
