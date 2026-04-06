import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAdminStats,
  fetchAllUsersAdmin,
  updateUserByAdmin,
  changeUserRoleAdmin,
  setUserAccessAdmin,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  updateAdminPermissions,
} from "./adminThunks.js";

const initialState = {
  stats: {
    totalUsers: 0,
    activeSubscriptions: 0,
    suspendedUsers: 0,
    deletedUsers: 0,
    totalTeachers: 0,
    totalAdmins: 0,
  },
  users: [],
  usersPagination: null,
  statsStatus: "idle",
  usersStatus: "idle",
  actionStatus: "idle",
  error: null,
};

const upsertUser = (state, updatedUser) => {
  const index = state.users.findIndex((u) => u._id === updatedUser._id);
  if (index === -1) {
    state.users.unshift(updatedUser);
  } else {
    state.users[index] = updatedUser;
  }
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminStats.pending, (state) => {
        state.statsStatus = "loading";
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.statsStatus = "succeeded";
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.statsStatus = "failed";
        state.error = action.payload || action.error?.message;
      })
      .addCase(fetchAllUsersAdmin.pending, (state) => {
        state.usersStatus = "loading";
        state.error = null;
      })
      .addCase(fetchAllUsersAdmin.fulfilled, (state, action) => {
        state.usersStatus = "succeeded";
        if (Array.isArray(action.payload)) {
          state.users = action.payload;
          state.usersPagination = null;
          return;
        }

        state.users = action.payload?.users || [];
        state.usersPagination = action.payload?.pagination || null;
      })
      .addCase(fetchAllUsersAdmin.rejected, (state, action) => {
        state.usersStatus = "failed";
        state.error = action.payload || action.error?.message;
      })
      .addCase(updateUserByAdmin.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(updateUserByAdmin.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        upsertUser(state, action.payload);
      })
      .addCase(updateUserByAdmin.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload || action.error?.message;
      })
      .addCase(changeUserRoleAdmin.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(changeUserRoleAdmin.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        upsertUser(state, action.payload);
      })
      .addCase(changeUserRoleAdmin.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload || action.error?.message;
      })
      .addCase(setUserAccessAdmin.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(setUserAccessAdmin.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        upsertUser(state, action.payload);
      })
      .addCase(setUserAccessAdmin.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload || action.error?.message;
      })
      // Admin management thunks
      .addCase(createAdmin.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        upsertUser(state, action.payload.user);
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload || action.error?.message;
      })
      .addCase(updateAdmin.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(updateAdmin.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        upsertUser(state, action.payload);
      })
      .addCase(updateAdmin.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload || action.error?.message;
      })
      .addCase(deleteAdmin.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        upsertUser(state, action.payload);
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload || action.error?.message;
      })
      .addCase(updateAdminPermissions.pending, (state) => {
        state.actionStatus = "loading";
        state.error = null;
      })
      .addCase(updateAdminPermissions.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        upsertUser(state, action.payload);
      })
      .addCase(updateAdminPermissions.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.error = action.payload || action.error?.message;
      });
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
