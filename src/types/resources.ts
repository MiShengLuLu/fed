export interface FormState {
  id?: number;
  name: string;
  url: string;
  categoryId: number | null;
  description?: string;
  current?: number;
  size?: number
}

export interface ResourcesItem {
  name: string;
  categoryId?: number;
  sort?: number;
  id: number;
  createdBy: string;
  url?: string;
  description?: string;
  updatedBy: string;
  createdTime: Date;
  selected: boolean;
  updatedTime: Date;
  operatorId: number
}
