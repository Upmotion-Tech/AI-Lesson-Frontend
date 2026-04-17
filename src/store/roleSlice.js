import { createSlice } from "@reduxjs/toolkit";
import { fetchRoles, fetchMyRole, updateMyRole, updateUserRole } from "./roleThunks.js";

const initialState = {
  // Available roles in the system
  availableRoles: [],
  // Current user's role info
  myRole: {
    systemRoles: [],
    educationalRole: null,
    educationalRoleLabel: null,
    canChangeRole: false,
  },
  // Loading states
  status: "idle",
  myRoleStatus: "idle",
  updateStatus: "idle",
  adminUpdateStatus: "idle",
  // Error states
  error: null,
  myRoleError: null,
  updateError: null,
  adminUpdateError: null,
};

const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    clearRoleErrors: (state) => {
      state.error = null;
      state.myRoleError = null;
      state.updateError = null;
      state.adminUpdateError = null;
    },
    resetUpdateStatus: (state) => {
      state.updateStatus = "idle";
      state.adminUpdateStatus = "idle";
    },
    // Action to update role in auth state when role changes
    updateEducationalRoleInState: (state, action) => {
      state.myRole.educationalRole = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all roles
      .addCase(fetchRoles.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.availableRoles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch roles";
      })

      // Fetch my role
      .addCase(fetchMyRole.pending, (state) => {
        state.myRoleStatus = "loading";
        state.myRoleError = null;
      })
      .addCase(fetchMyRole.fulfilled, (state, action) => {
        state.myRoleStatus = "succeeded";
        state.myRole = action.payload;
      })
      .addCase(fetchMyRole.rejected, (state, action) => {
        state.myRoleStatus = "failed";
        state.myRoleError = action.payload || "Failed to fetch role information";
      })

      // Update my role
      .addCase(updateMyRole.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateMyRole.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        // Update myRole with the new educational role from response
        if (action.payload.user?.educationalRole) {
          state.myRole.educationalRole = action.payload.user.educationalRole;
        }
      })
      .addCase(updateMyRole.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload || "Failed to update role";
      })

      // Admin: Update user role
      .addCase(updateUserRole.pending, (state) => {
        state.adminUpdateStatus = "loading";
        state.adminUpdateError = null;
      })
      .addCase(updateUserRole.fulfilled, (state) => {
        state.adminUpdateStatus = "succeeded";
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.adminUpdateStatus = "failed";
        state.adminUpdateError = action.payload || "Failed to update user role";
      });
  },
});

export const { clearRoleErrors, resetUpdateStatus, updateEducationalRoleInState } = roleSlice.actions;
export default roleSlice.reducer;
