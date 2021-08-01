import { Result } from '@/types/base'
import { Role, SubMenu } from '@/types/roles'
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

interface GetRole extends Result {
  data: Role
}

interface GetMenuRole extends Result {
  data: Array<SubMenu>
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

// 获取角色拥有的菜单列表
export const getRoleMenus = (params: { roleId: number }): Promise<{ data: GetMenuRole }> => {
  return request({
    method: 'get',
    url: '/boss/menu/getRoleMenus',
    params
  })
}
