export interface Role {
  id?: number;
  name?: string;
  code?: string;
  description?: string
}

export interface SubMenu {
  parentId: number;
  selected: true;
  id: number;
  name: string;
  subMenuList: Array<SubMenu>;
  href: string;
  icon: string;
  orderNum: number;
  description: string;
  shown: boolean;
  level: number;
}
