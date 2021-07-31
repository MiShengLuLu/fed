import request from '@/utils/request'
import qs from 'qs'
import { Content, RefreshContent } from '@/types/user'
import { frontResult } from '@/types/base'

interface User {
  phone: string;
  password: string
}
interface Login extends frontResult {
  content: string
}
interface UserInfo extends frontResult {
  content: Content
}

interface RefreshToken extends frontResult {
  content: RefreshContent
}

// 登陆
export const login = (data: User): Promise<{ data: Login }> => {
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
export const getUserInfo = (): Promise<{ data: UserInfo }> => {
  return request({
    method: 'get',
    url: '/front/user/getInfo'
  })
}

// refresh token
export const refreshToken = (data: User): Promise<{ data: RefreshToken }> => {
  return request({
    method: 'post',
    url: '/front/user/refresh_token',
    data: qs.stringify(data)
  })
}
