export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  status: number;
  message?: string;
  data: T;
  errors?: ApiFieldError[];
  timestamp?: string;
}

export interface PageResult<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface PageQuery {
  page?: number;
  size?: number;
  sort?: string;
}

export interface NavigationNode {
  key: string;
  label: string;
  actions: string[];
  children: NavigationNode[];
}

export interface RoleSummary {
  id: string;
  name: string;
}

export interface UserResponse {
  id: string;
  username: string;
  active: boolean;
  roles: RoleSummary[];
  permissions: string[];
}

