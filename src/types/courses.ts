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
