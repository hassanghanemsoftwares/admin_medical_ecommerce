import { getAllSettings } from '@/lib/services/settings-service';
import {
    Permission,
    Role,
    Category,
    Brand,
    ColorSeason,
    Color,
    Configuration,
    Occupation,
    Shelf,
    Size,
    Tag,
    Warehouse,
} from '@/types/api.interfaces';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface SettingsState {
    roles: Role[];
    permissions: Permission[];

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

    loading: boolean;
    error: string | null;
}

const initialState: SettingsState = {
    roles: [],
    permissions: [],

    categories: [],
    brands: [],
    color_seasons: [],
    colors: [],
    configurations: [],
    occupations: [],
    shelves: [],
    sizes: [],
    tags: [],
    warehouses: [],

    loading: false,
    error: null,
};

export const fetchSettings = createAsyncThunk(
  'settings/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllSettings();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load settings');
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as { settings: SettingsState };
      const {
        roles,
        permissions,
        categories,
        brands,
        color_seasons,
        colors,
        configurations,
        occupations,
        shelves,
        sizes,
        tags,
        warehouses,
      } = state.settings;
      
      const shouldFetch =
        roles.length === 0 ||
        permissions.length === 0 ||
        categories.length === 0 ||
        brands.length === 0 ||
        color_seasons.length === 0 ||
        colors.length === 0 ||
        configurations.length === 0 ||
        occupations.length === 0 ||
        shelves.length === 0 ||
        sizes.length === 0 ||
        tags.length === 0 ||
        warehouses.length === 0;

      return shouldFetch;
    },
  }
);


export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSettings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSettings.fulfilled, (state, action) => {
                state.loading = false;

                state.roles = action.payload.roles;
                state.permissions = action.payload.permissions;

                state.categories = action.payload.categories;
                state.brands = action.payload.brands;
                state.color_seasons = action.payload.color_seasons;
                state.colors = action.payload.colors;
                state.configurations = action.payload.configurations;
                state.occupations = action.payload.occupations;
                state.shelves = action.payload.shelves;
                state.sizes = action.payload.sizes;
                state.tags = action.payload.tags;
                state.warehouses = action.payload.warehouses;
            })
            .addCase(fetchSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default settingsSlice.reducer;
