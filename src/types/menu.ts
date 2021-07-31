// 更新菜单入参
export interface FormState {
  id?: number | undefined;
  name: string;
  href: string;
  parentId: number;
  description: string;
  icon: string;
  shown: boolean;
  orderNum: number | undefined | null
}
