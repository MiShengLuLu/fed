import request from '@/utils/request'
import { FormState, ResourcesItem } from '@/types/resources'
import { Result } from '@/types/base'

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

interface GetCategory extends Result {
  data: Array<ResourcesItem>
}

interface UpdateResource extends Result {
  data: boolean
}

// 更新分页查询资源列表
export const getResourcePages = (data: FormState): Promise<{ data: GetAllResources}> => {
  return request({
    method: 'post',
    url: '/boss/resource/getResourcePages',
    data
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

// 删除资源
export const deleteResource = (id: number): Promise<{ data: UpdateResource}> => {
  return request({
    method: 'delete',
    url: `/boss/resource/${id}`
  })
}

// 更新资源信息
export const updateResource = (data: FormState): Promise<{ data: UpdateResource }> => {
  return request({
    method: 'post',
    url: '/boss/resource/saveOrUpdate',
    data
  })
}
