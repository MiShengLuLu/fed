import { Result } from '@/types/base'
import { Role } from '@/types/roles'
import request from '@/utils/request'

interface GetRoles extends Result {
  data: {
    records: Array<Role>,
    total: number
  }
}

interface Update extends Result {
  data: boolean
}

interface GetAllRole extends Result {
  data: Role[]
}

interface GetRole extends Result {
  data: Role
}

// 根据分页搜索条件查询角色列表
export const query = (data: Role): Promise<{ data: GetRoles }> => {
  return request({
    method: 'post',
    url: '/boss/role/getRolePages',
    data
  })
}

// 更新角色信息
export const update = (data: Role): Promise<{ data: Update}> => {
  return request({
    method: 'post',
    url: '/boss/role/saveOrUpdate',
    data
  })
}

// 根据 id 查询角色
export const getRoleById = (id: number): Promise<{ data: GetRole }> => {
  return request({
    method: 'get',
    url: `/boss/role/${id}`
  })
}

// 删除角色信息
export const del = (id: number): Promise<{ data: Update }> => {
  return request({
    method: 'delete',
    url: `/boss/role/${id}`
  })
}

// 获取所有角色
export const getRoles = (): Promise<{ data: GetAllRole }> => {
  return request({
    method: 'get',
    url: '/boss/role/all'
  })
}

// 给用户分配角色
export const allocateUserRoles = (data: { userId: number; roleIdList: number[] }): Promise<{ data: Update}> => {
  return request({
    method: 'post',
    url: '/boss/role/allocateUserRoles',
    data
  })
}

// 查询用户角色
export const getRolesById = (userId: number): Promise<{ data: GetAllRole }> => {
  return request({
    method: 'get',
    url: `/boss/role/user/${userId}`
  })
}
