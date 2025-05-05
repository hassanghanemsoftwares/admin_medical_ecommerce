export interface Session {
  id: string;
  device: string; 
  last_activity: number;
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

export interface Category {

  id: number;
  name: Record<string, string>;
  arrangement: string;
  image: string;
  is_active: boolean;

}

export interface ActivityLog {
  id: number;
  log_name: string; 
  description: string; 
  subject_type: string | null;
  subject_id: number | null;
  causer_type: string | null;
  causer_id: number | null;
  causer_name: string | null;
  properties: Record<string, any>; 
  created_at: string; 
}

export interface Role {
  id: number;
  name: string;
}

export interface Permission {
  id: number;
  name: string;
}