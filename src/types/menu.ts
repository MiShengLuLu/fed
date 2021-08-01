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

export interface MenuItem {// 角色菜单项
  id: number;
  name: string,
  subMenuList: Array<MenuItem>,
  selected: boolean
}

export interface RoleMenuItem {// 查询角色菜单入参
  roleId: number | string;
  menuIdList: string[]
}
