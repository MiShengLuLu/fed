import request from '@/utils/request'
import { ResourcesItem, CategoryItem, AllocateRoleResources } from '@/types/resources'
import { Result, Pagination } from '@/types/base'

interface GetAll extends Result {
  data: ResourcesItem[]
}
interface GetAllResources extends Result {
  data: {
    pages: number;
    searchCount: number;
    records: ResourcesItem[];
    total: number;
    size: number;
    current: number
  }
}
interface GetResource extends Result {
  data: ResourcesItem
}
interface Update extends Result {
  data: boolean
}
interface GetCategory extends Result {
  data: Array<CategoryItem>
}

interface GetRoleResources extends Result {
  data: ResourcesItem[]
}

// 获取所有资源
export const getAll = (): Promise<{ data: GetAll }> => {
  return request({
    method: 'get',
    url: '/boss/resource/getAll'
  })
}
// 根据分页查询资源列表
export const getResourcePages = (data: ResourcesItem & Pagination): Promise<{ data: GetAllResources}> => {
  return request({
    method: 'post',
    url: '/boss/resource/getResourcePages',
    data
  })
}
// 删除资源
export const deleteResource = (id: number): Promise<{ data: Update}> => {
  return request({
    method: 'delete',
    url: `/boss/resource/${id}`
  })
}
// 更新资源信息
export const updateResource = (data: ResourcesItem): Promise<{ data: Update }> => {
  return request({
    method: 'post',
    url: '/boss/resource/saveOrUpdate',
    data
  })
}
// 根据 id 查询资源信息
export const getResourceById = (id: number): Promise<{ data: GetResource}> => {
  return request({
    method: 'get',
    url: `/boss/resource/${id}`
  })
}

// 获取资源分类列表
export const getCategory = (resourceId?: number): Promise<{ data: GetCategory }> => {
  return request({
    method: 'get',
    url: '/boss/resource/category/getAll',
    params: {
      resourceId
    }
  })
}
// 更新资源分类信息
export const updateCategory = (data: CategoryItem): Promise<{ data: Update }> => {
  return request({
    method: 'post',
    url: '/boss/resource/category/saveOrderUpdate',
    data
  })
}
// 删除资源分类项，如果资源分类项还有子分类项，不允许删除
export const deleteCategory = (id: number): Promise<{ data: Update }> => {
  return request({
    method: 'delete',
    url: `/boss/resource/category/${id}`
  })
}

// 给角色分配资源
export const allocateRoleResources = (data: AllocateRoleResources): Promise<{ data: Update }> => {
  return request({
    method: 'post',
    url: '/boss/resource/allocateRoleResources',
    data
  })
}
// 获取角色拥有的资源列表
export const getRoleResources = (roleId: number): Promise<{ data: GetRoleResources }> => {
  return request({
    method: 'get',
    url: '/boss/resource/getRoleResources',
    params: {
      roleId
    }
  })
}
