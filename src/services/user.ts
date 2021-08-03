import request from '@/utils/request'
import qs from 'qs'
import { Content, RefreshContent, UserItem, QueryUser } from '@/types/user'
import { frontResult, Result } from '@/types/base'
import { MenuItem } from '@/types/menu'
import { ResourcesItem } from '@/types/resources'

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

interface GetUserPage extends Result {
  data: {
    records: UserItem[],
    total: number
  }
}

interface ChangeUserStatus extends Result {
  data: {
    status: boolean
  }
}

interface GetUserPermissions extends frontResult {
  content: {
    menuList: MenuItem[];
    resourceList: ResourcesItem[]
  }
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

// 根据条件查询获取用户列表
export const getUserPage = (data: QueryUser): Promise<{ data: GetUserPage }> => {
  return request({
    method: 'post',
    url: '/boss/user/getUserPages',
    data
  })
}

// 禁用用户
export const forbidUser = (userId: number): Promise<{ data: ChangeUserStatus}> => {
  return request({
    method: 'post',
    url: '/boss/user/forbidUser',
    data: {
      userId
    }
  })
}

// 启用用户
export const enableUser = (userId: number): Promise<{ data: ChangeUserStatus }> => {
  return request({
    method: 'get',
    url: '/boss/user/enableUser',
    params: {
      userId
    }
  })
}

export const getUserPermissions = (): Promise<{ data: GetUserPermissions }> => {
  return request({
    method: 'get',
    url: '/boss/permission/getUserPermissions'
  })
}
