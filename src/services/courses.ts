import request from '@/utils/request'
import { Result } from '@/types/base'
import { CourseQuery, Course } from '@/types/courses'

interface GetCourses extends Result {
  data: {
    records: Course[],
    total: number
  }
}
interface Update extends Result {
  data: boolean
}

// 获取课程
export const getQueryCourses = (data: CourseQuery & { pageSize: number; currentPage: number }): Promise<{ data: GetCourses }> => {
  return request({
    method: 'post',
    url: '/boss/course/getQueryCourses',
    data
  })
}
// 课程上下架
export const changeState = (params: { courseId: number; status: number }): Promise<{ data: Update}> => {
  return request({
    method: 'get',
    url: 'boss/course/changeState',
    params
  })
}
