import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../utils/apiClient.js";
import { fetchMe } from "./authThunks.js";

// Fetch all available educational roles
export const fetchRoles = createAsyncThunk(
  "roles/fetchRoles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/roles");
      return response.data.roles;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch roles";
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch current user's role information
export const fetchMyRole = createAsyncThunk(
  "roles/fetchMyRole",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/roles/me");
      return response.data.role;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch role information";
      return rejectWithValue(errorMessage);
    }
  }
);

// Update current user's educational role
export const updateMyRole = createAsyncThunk(
  "roles/updateMyRole",
  async ({ educationalRole }, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiClient.put("/roles/profile/role", {
        educationalRole,
      });
      // Refresh user details after role change
      dispatch(fetchMe());
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update role";
      return rejectWithValue(errorMessage);
    }
  }
);

// Admin: Update any user's educational role
export const updateUserRole = createAsyncThunk(
  "roles/updateUserRole",
  async ({ userId, educationalRole }, { dispatch, rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/roles/users/${userId}/role`, {
        educationalRole,
      });
      // Refresh user details after role change (in case admin changed their own role)
      dispatch(fetchMe());
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update user role";
      return rejectWithValue(errorMessage);
    }
  }
);
