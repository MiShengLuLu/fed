import request from '@/utils/request'
import { AliyunVideoUpload, AliyunTransCode } from '@/@types/upload'

// 获取阿里云图片上传凭证
export const aliyunImagUploadAddressAdnAuth = () => {
  return request({
    method: 'get',
    url: '/boss/course/upload/aliyunImagUploadAddressAdnAuth.json'
  })
}

// 获取阿里云视频上传凭证
export const aliyunVideoUploadAddressAdnAuth = (params: AliyunVideoUpload) => {
  return request({
    method: 'get',
    url: '/boss/course/upload/aliyunVideoUploadAddressAdnAuth.json',
    params
  })
}

// 阿里云转码请求
export const aliyunTransCode = (data: AliyunTransCode) => {
  return request({
    method: 'post',
    url: '/boss/course/upload/aliyunTransCode.json',
    data
  })
}

// 阿里云转码进度
export const aliyunTransCodePercent = (lessonId: number) => {
  return request({
    method: 'post',
    url: '/boss/course/upload/aliyunTransCodePercent.json',
    params: {
      lessonId
    }
  })
}
