
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

export interface Session {
  id: string;
  device: string; last_activity: number;
  last_activity_human: string;
  ip_address: string;
  location: string;
  browser: string;
  platform: string;
  is_current_device: boolean;
  is_mobile: boolean;
  is_tablet: boolean;
  is_desktop: boolean;
  is_robot: boolean;
}
export interface User {
  id: number;
  name: string;
  email: string;
  image: string;
  token: string;
  role: string;
  is_active: boolean;
  permissions: string[];
  sessions: Session[];
  teams: Team[];
}
export interface Team {
  id: number;
  name: string;
}

export interface Pagination {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface GetUsersResponse {
  result: boolean;
  message: string;
  users: User[];
  pagination: Pagination;
}
export interface GetActivityLogsResponse {
  result: boolean;
  message: string;
  logs: ActivityLog[];
  pagination: Pagination;
}
export interface ActivityLog {
  id: number;
  log_name: string; // Localized string from `__('activity.models.*')`
  description: string; // Localized description with :model replaced
  subject_type: string | null;
  subject_id: number | null;
  causer_type: string | null;
  causer_id: number | null;
  causer_name: string | null;
  properties: Record<string, any>; // Can be more specific if needed
  created_at: string; // ISO 8601 datetime string
}

export interface GetAllSettingsResponse {
  result: boolean;
  message: string;
  roles: Role[];
  permissions: Permission[];
  teams: Team[];
}

export interface Role {
  id: number;
   name: string;
}
export interface Permission {
  id: number;
  name: string;
}