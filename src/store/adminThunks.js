import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../utils/apiClient.js";

export const fetchAdminStats = createAsyncThunk(
  "admin/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/users/admin/stats");
      return response.data.stats;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch admin stats"
      );
    }
  }
);

export const checkEmailAvailability = createAsyncThunk(
  "admin/checkEmailAvailability",
  async (email, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/users/check-email", {
        params: { email },
      });
      return response.data.available;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to check email"
      );
    }
  }
);

export const fetchAllUsersAdmin = createAsyncThunk(
  "admin/fetchAllUsers",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = {};
      if (params?.page !== undefined) queryParams.page = params.page;
      if (params?.limit !== undefined) queryParams.limit = params.limit;
      if (params?.search !== undefined) queryParams.search = params.search;
      if (params?.sortBy !== undefined) queryParams.sortBy = params.sortBy;
      if (params?.sortOrder !== undefined) queryParams.sortOrder = params.sortOrder;
      if (params?.role !== undefined) queryParams.role = params.role;
      if (params?.status !== undefined) queryParams.status = params.status;
      if (params?.subscription !== undefined) queryParams.subscription = params.subscription;

      const response = await apiClient.get("/users/all", {
        params: Object.keys(queryParams).length ? queryParams : undefined,
      });

      const users = response.data.users || [];
      const pagination = response.data.pagination;

      if (pagination) {
        return { users, pagination };
      }

      return users;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const updateUserByAdmin = createAsyncThunk(
  "admin/updateUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch("/users/update", payload);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user"
      );
    }
  }
);

export const changeUserRoleAdmin = createAsyncThunk(
  "admin/changeRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch("/users/changeRole", { id, role });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to change user role"
      );
    }
  }
);

export const setUserAccessAdmin = createAsyncThunk(
  "admin/setAccess",
  async ({ id, action }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/users/${id}/access`, { action });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user access"
      );
    }
  }
);

// Admin management thunks (super_admin only)
export const createAdmin = createAsyncThunk(
  "admin/createAdmin",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/users/admins", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create admin"
      );
    }
  }
);

export const updateAdmin = createAsyncThunk(
  "admin/updateAdmin",
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/users/admins/${id}`, data);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update admin"
      );
    }
  }
);

export const deleteAdmin = createAsyncThunk(
  "admin/deleteAdmin",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/users/admins/${id}`);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete admin"
      );
    }
  }
);

export const hardDeleteAdmin = createAsyncThunk(
  "admin/hardDeleteAdmin",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/users/hard-delete/${id}`);
      return id; // Return ID of deleted admin
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to permanently delete admin"
      );
    }
  }
);

export const updateAdminPermissions = createAsyncThunk(
  "admin/updateAdminPermissions",
  async ({ id, permissions }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch(`/users/admins/${id}/permissions`, { permissions });
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update permissions"
      );
    }
  }
);
