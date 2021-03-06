export interface frontResult {
  message: string;
  state: number;
  success: boolean
}

export interface Result {
  code: string;
  mesg: string;
  time: number
}

export interface Pagination {
  current: number;
  size: number
}
