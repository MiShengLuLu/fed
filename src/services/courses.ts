import request from '@/utils/request'
import { Result } from '@/types/base'
import { CourseQuery, Course, UploadFile, FormState, Section, Lesson } from '@/types/courses'

interface GetCourses extends Result {
  data: {
    records: Course[],
    total: number
  }
}
interface Update extends Result {
  data: boolean
}

interface UploadResult extends Result {
  data: UploadFile
}

interface UpdateCourse extends Result {
  data: FormState
}

interface SectionResult extends Result {
  data: Section[]
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

// 图片上传
export const avatarUpload = (data: FormData): Promise<{ data: UploadResult }> => {
  return request({
    method: 'post',
    url: '/boss/course/upload',
    data
  })
}

// 更新课程信息
export const saveOrUpdateCourse = (data: FormState): Promise<{ data: Result }> => {
  return request({
    method: 'post',
    url: '/boss/course/saveOrUpdateCourse',
    data
  })
}

// 根据 id 查询课程信息
export const getCourseById = (courseId: number): Promise<{ data: UpdateCourse }> => {
  return request({
    method: 'get',
    url: '/boss/course/getCourseById',
    params: {
      courseId
    }
  })
}

// 获取课程的模块与课时
export const getSectionAndLesson = (courseId: number): Promise<{ data: SectionResult }> => {
  return request({
    method: 'get',
    url: '/boss/course/section/getSectionAndLesson',
    params: {
      courseId
    }
  })
}

// 保存课程章节信息
export const saveOrUpdateSection = (data: Section & { courseId: number }): Promise<{ data: Result }> => {
  return request({
    method: 'post',
    url: '/boss/course/section/saveOrUpdateSection',
    data
  })
}

// 保存课时信息
export const saveOrUpdate = (data: Lesson & { courseId: number }): Promise<{ data: Result }> => {
  return request({
    method: 'post',
    url: '/boss/course/lesson/saveOrUpdate',
    data
  })
}

// 图片上传
export const imgUpload = (data: FormData): Promise<{ data: Result }> => {
  return request({
    method: 'post',
    url: '/boss/course/upload',
    data
  })
}
