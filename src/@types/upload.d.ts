import request from '@/utils/request'

export interface AliyunVideoUpload {
  fileName: string;
  imageUrl: string
}

interface AliyunUploadResult {
  fileURL: string;
  imageURL: string;
  requestId: string;
  uploadAdress: string;
  uploadAuth: string
}
export interface ImageUploadResult extends AliyunUploadResult {
  imageId: string;
}
export interface VideoUploadResult extends AliyunUploadResult {
  videoId: string
}

export interface AliyunTransCode {
  id: number,
  courseId: number,
  sectionId: number,
  lessonId: number,
  channel: number,
  mediaType: number,
  coverImageUrl: string,
  duration: string,
  fileId: string,
  fileUrl: string,
  fileEdk: string,
  fileSize: number,
  fileName: string,
  fileDk: string,
  createTime: string,
  updateTime: string,
  status: number,
  isDel: boolean,
  lastOperatorId: number,
  durationNum: number
}
