// src/store/settingsSlice.ts
import { getAllSettings } from '@/lib/services/settings-service';
import { Permission, Role } from '@/types/apiTypes';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface SettingsState {
    roles: Role[];
    permissions: Permission[];
    loading: boolean;
    error: string | null;
}

const initialState: SettingsState = {
    roles: [],
    permissions: [],
    loading: false,
    error: null,
};

// Async thunk to fetch roles and permissions
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
            const { roles, permissions } = state.settings;

            // Only fetch if either roles or permissions are empty
            return roles.length === 0 || permissions.length === 0;
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
            })
            .addCase(fetchSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default settingsSlice.reducer;
