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

export interface Brand {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}
export interface Color {
  id: number;
  name: Record<string, string>;
  code: string;
  color_season_id: number;
  color_season: ColorSeason | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ColorSeason {
  id: number;
  name: Record<string, string>;
  created_at: string | null;
  updated_at: string | null;
}
export interface Occupation {
  id: number;
  name: Record<string, string>;
  created_at: string | null;
  updated_at: string | null;
}
export interface Configuration {
  key: string;
  value: string;
}


export interface HomeSection {
  id: number;
  type: string;
  title: string;
  content: string;
  arrangement: number;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
}
export interface LearningVideo {
  id: number;
  title: string;
  description: string;
  video: string;
  created_at: string | null;
  updated_at: string | null;
}


export interface Size {
  id: number;
  name: Record<string, string>;
  created_at: string | null;
  updated_at: string | null;
}
export interface Tag {
  id: number;
  name: string;
  created_at: string | null;
  updated_at: string | null;
}
export interface Warehouse {
  id: number;
  name: string;
  location: string;
  created_at: string | null;
  updated_at: string | null;
}


export interface Shelf {
  id: number;
  warehouse_id: number;
  warehouse: Warehouse | null;
  name: string;
  location: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Variant {
  id: number;
  product_id: number;
  size: Size;
  color: Color;
}


export interface ProductImage {
  id: number;
  arrangement: string;
  image: string;
  is_active: boolean;
}




export interface Product {
  id: number;
  name: Record<string, string>;
  short_description: Record<string, string>;
  description: Record<string, string>;
  barcode: string;
  slug: string;
  availability_status: string;
  category: Category;
  brand: Brand;
  price: number;
  discount: number;
  min_order_quantity: number;
  max_order_quantity: number;
  image: string;
  images: ProductImage[];
  variants: Variant[];
  tags: Tag[];
  created_at: string | null;
  updated_at: string | null;
}