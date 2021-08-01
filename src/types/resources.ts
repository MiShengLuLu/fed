export interface ResourcesItem {
  name?: string;
  categoryId?: number | null;
  id?: number;
  url?: string;
  description?: string;
  selected?: boolean
}

export interface CategoryItem {
  id?: number;
  name?: string;
  sort?: number | null;
  createdTime?: Date,
  selected?: boolean
}

export interface AllocateRoleResources {
  roleId: number;
  resourceIdList: number[]
}
