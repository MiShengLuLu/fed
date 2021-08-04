import { Moment } from 'moment'

export interface CourseQuery {
  status: number | null;
  courseName: string
}

export interface Course {
  id: number;
  status: number;
  courseName: string;
  price: number;
  sortNum: number
}

export interface FormState {
  id?: number | null;
  courseName: string;
  brief: string;
  teacherDTO: {
    teacherName: string;
    position: string;
    description: string
  },
  previewFirstField: string,
  previewSecondField: string,
  courseListImg?: string;
  courseImgUrl?: string;
  sortNum: number | null;
  discounts: number | null;
  price?: number | null;
  sales?: number | null;
  discountsTag?: string;
  activityCourse?: boolean;
  activityCourseDTO: {
    beginTime?: Moment | null;
    endTime?: Moment | null;
    amount?: number | null;
    stock?: number | null
  },
  courseDescriptionMarkDown: string
}

export interface UploadFile {
  name: string
}

// 课时
export interface Lesson {
  id?: number | null;
  theme: string;
  sectionId?: number | null;
  courseId: number;
  duration: string | null;
  isFree: boolean;
  orderNum: number | null;
  status?: number
}

// 章节
export interface Section {
  id?: number | null;
  sectionName: string;
  lessonDTOS?: Array<Lesson>;
  courseId: number;
  description: string;
  orderNum: number | null;
  status?: number
}
