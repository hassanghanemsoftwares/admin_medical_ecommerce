import { ActivityLog, Category, Pagination, Permission, Role, Team, User } from "./api.interfaces";

export interface LoginResponse {
    result: boolean;
    message: string;
    otp: number | null;
  }
  
  export interface AuthResponse {
    result: boolean;
    message: string;
    user?: {
      email: string;
      name: string;
      token: string;
    } | null;
  }
  
  export interface ApiResponse {
    result: boolean;
    message: string;
  }
  
  export interface GetUsersResponse {
    result: boolean;
    message: string;
    users: User[];
    pagination: Pagination;
  }
  
  export interface GetCategoriesResponse {
    result: boolean;
    message: string;
    categories: Category[];
    pagination: Pagination;
  }
  
  export interface GetActivityLogsResponse {
    result: boolean;
    message: string;
    logs: ActivityLog[];
    pagination: Pagination;
  }
  
  export interface GetAllSettingsResponse {
    result: boolean;
    message: string;
    roles: Role[];
    permissions: Permission[];
    teams: Team[];
  }