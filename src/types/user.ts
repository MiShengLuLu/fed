// 用户信息
export interface Content {
  isUpdatedPassword: boolean;
  portrait: string;
  userName: string
}

// refresh_token
export interface RefreshContent {
  'access_token': string;
  'expires_in': number;
  'refresh_token': string;
  'user_id': string
}

export interface QueryUser {
  phone: string;
  startCreateTime: string;
  endCreateTime: string;
  currentPage: number;
  pageSize: number
}
export interface UserItem {
  phone: string;
  startCreateTime: string;
  endCreateTime: string;
  status: string;
  id: number
}
