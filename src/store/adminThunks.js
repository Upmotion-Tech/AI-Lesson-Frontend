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
