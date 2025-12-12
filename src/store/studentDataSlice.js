import { createSlice } from "@reduxjs/toolkit";
import {
  uploadStudentData,
  fetchLatestStudentData,
  fetchAllStudentData,
  deleteStudentData,
  fetchStudentDataById,
} from "./studentDataThunks.js";

const initialState = {
  latest: null,
  current: null, // Currently viewed student data
  list: [], // All student data records
  status: "idle",
  uploadStatus: "idle",
  error: null,
};

const studentDataSlice = createSlice({
  name: "studentData",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload student data
      .addCase(uploadStudentData.pending, (state) => {
        state.uploadStatus = "loading";
        state.error = null;
      })
      .addCase(uploadStudentData.fulfilled, (state, action) => {
        state.uploadStatus = "succeeded";
        if (action.payload.studentData) {
          state.latest = action.payload.studentData;
        }
        // Update list if studentDataList is provided
        if (action.payload.studentDataList) {
          state.list = action.payload.studentDataList;
        }
      })
      .addCase(uploadStudentData.rejected, (state, action) => {
        state.uploadStatus = "failed";
        state.error = action.error.message || "Upload failed";
      })
      // Fetch latest student data
      .addCase(fetchLatestStudentData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLatestStudentData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.latest = action.payload;
      })
      .addCase(fetchLatestStudentData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch student data";
      })
      // Fetch all student data
      .addCase(fetchAllStudentData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllStudentData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
        // Update latest if list is not empty
        if (action.payload.length > 0) {
          state.latest = action.payload[0];
        }
      })
      .addCase(fetchAllStudentData.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to fetch student data";
      })
      // Delete student data
      .addCase(deleteStudentData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteStudentData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = state.list.filter((s) => s._id !== action.payload);
        // Update latest if deleted was the latest
        if (state.latest?._id === action.payload) {
          state.latest = state.list.length > 0 ? state.list[0] : null;
        }
      })
      .addCase(deleteStudentData.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to delete student data";
      })
      // Fetch student data by ID
      .addCase(fetchStudentDataById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchStudentDataById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.current = action.payload;
      })
      .addCase(fetchStudentDataById.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to fetch student data";
      });
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrent: (state) => {
      state.current = null;
    },
  },
});

export const { clearError, clearCurrent } = studentDataSlice.actions;
export default studentDataSlice.reducer;


