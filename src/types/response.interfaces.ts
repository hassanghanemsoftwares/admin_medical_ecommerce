import { ActivityLog, Brand, Category, Color, ColorSeason, Configuration, HomeSection, LearningVideo, Occupation, Pagination, Permission, Product, ProductVariant, Role, Shelf, Size, Stock, StockAdjustment, Tag, Team, User, Warehouse } from "./api.interfaces";

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
  categories: Category[];
  brands: Brand[];
  color_seasons: ColorSeason[];
  colors: Color[];
  configurations: Configuration[];
  occupations: Occupation[];
  shelves: Shelf[];
  sizes: Size[];
  tags: Tag[];
  warehouses: Warehouse[];
}
export interface GetBrandsResponse {
  result: boolean;
  message: string;
  brands: Brand[];
  pagination: Pagination;
}
export interface GetColorsResponse {
  result: boolean;
  message: string;
  colors: Color[];
  pagination: Pagination;
}
export interface GetColorSeasonsResponse {
  result: boolean;
  message: string;
  color_seasons: ColorSeason[];
  pagination: Pagination;
}
export interface GetOccupationsResponse {
  result: boolean;
  message: string;
  occupations: Occupation[];
  pagination: Pagination;
}

export interface GetConfigurationsResponse {
  result: boolean;
  message: string;
  configurations: Configuration[];
}

export interface GetHomeSectionsResponse {
  result: boolean;
  message: string;
  homeSections: HomeSection[];
}

export interface GetLearningVideosResponse {
  result: boolean;
  message: string;
  learningVideos: LearningVideo[];
  pagination: Pagination;
}

export interface GetSizesResponse {
  result: boolean;
  message: string;
  sizes: Size[];
  pagination: Pagination;
}
export interface GetTagsResponse {
  result: boolean;
  message: string;
  tags: Tag[];
  pagination: Pagination;
}

export interface GetWarehousesResponse {
  result: boolean;
  message: string;
  warehouses: Warehouse[];
  pagination: Pagination;
}

export interface GetShelvesResponse {
  result: boolean;
  message: string;
  shelves: Shelf[];
  pagination: Pagination;
}


export interface GetProductsResponse {
  result: boolean;
  message: string;
  products: Product[];
  pagination: Pagination;
}
export interface GetProductResponse {
  result: boolean;
  message: string;
  product?: Product;

}


export interface GetStockAdjustmentsResponse {
  result: boolean;
  message: string;
  adjustments: StockAdjustment[];
  pagination: Pagination;
}

export interface GetStocksResponse {
  result: boolean;
  message: string;
  stocks: Stock[];
  pagination: Pagination;
}

export interface GetProductVariantsResponse {
  result: boolean;
  message: string;
  productVariants: ProductVariant[];
}

