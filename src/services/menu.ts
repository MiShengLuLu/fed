import request from '@/utils/request'
import { FormState, MenuItem } from '@/types/menu'
import { Result } from '@/types/base'

interface MenuUpdate extends Result {
  data: boolean
}

interface GetEditMenu extends Result {
  data: {
    parentMenuList: FormState[];
    menuInfo: FormState
  }
}

interface GetAllMenus extends Result {
  data: Array<FormState>
}

interface GetMenuNodeList extends Result {
  data: Array<MenuItem>
}

// 更新菜单
export const menuUpdate = (data: FormState): Promise<{ data: MenuUpdate }> => {
  return request({
    method: 'post',
    url: '/boss/menu/saveOrUpdate',
    data
  })
}

// 获取上一级菜单
export const getEditMenu = (id = -1): Promise<{ data: GetEditMenu }> => {
  return request({
    method: 'get',
    url: '/boss/menu/getEditMenuInfo',
    params: { id }
  })
}

// 获取菜单列表
export const getAllMenus = (): Promise<{ data: GetAllMenus }> => {
  return request({
    method: 'get',
    url: '/boss/menu/getAll'
  })
}

// 删除菜单项
export const menuDelete = (id: number): Promise<{ data: MenuUpdate }> => {
  return request({
    method: 'delete',
    url: `/boss/menu/${id}`
  })
}

// 查询所有菜单并按层级展示
export const getMenuNodeList = (): Promise<{ data: GetMenuNodeList }> => {
  return request({
    method: 'get',
    url: '/boss/menu/getMenuNodeList'
  })
}

// 给角色分配菜单
export const allocateRoleMenus = (data: {
  roleId: number | string;
  menuIdList: number[]
}): Promise<{ data: MenuUpdate }> => {
  return request({
    method: 'post',
    url: '/boss/menu/allocateRoleMenus',
    data
  })
}
// 获取角色拥有的菜单
export const getRoleMenus = (roleId: number | string): Promise<{ data: GetMenuNodeList }> => {
  return request({
    method: 'get',
    url: '/boss/menu/getRoleMenus',
    params: {
      roleId
    }
  })
}
