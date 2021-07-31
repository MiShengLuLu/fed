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
