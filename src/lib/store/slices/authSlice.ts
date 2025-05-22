import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@/types/api.interfaces";
import { signOutRequest } from "@/lib/services/profile-service";


interface AuthState {
    email: string;
    password: string;
    expiryAt: string;
    user: User | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    email: "",
    password: "",
    expiryAt: "",
    user: null,
    isAuthenticated: false,
};

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
      try {
        const response = await signOutRequest();
        if (!response.result) {
          throw new Error(response.message || "Logout failed");
        }
        clearAllStorage();
        return response;
      } catch (error: any) {
        clearAllStorage();
        return rejectWithValue(error.message);
      }
    }
  );
  

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthData: (state, { payload }: PayloadAction<Pick<AuthState, "email" | "password" | "expiryAt">>) => {
            Object.assign(state, payload);
        },
        setUserData: (state, { payload }: PayloadAction<User>) => {
            state.user = payload;
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(logout.fulfilled, () => {
                return initialState; // Reset state on successful logout
            })
            .addCase(logout.rejected, () => {
                return initialState; // Reset state on logout failure
            });
    }
});

export const { setAuthData, setUserData } = authSlice.actions;
export default authSlice.reducer;


const clearAllStorage = () => {
    // Clear local and session storage
    localStorage.clear();
    sessionStorage.clear();

    // Clear all cookies
    document.cookie.split(";").forEach((cookie) => {
        const name = cookie.split("=")[0].trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
};
