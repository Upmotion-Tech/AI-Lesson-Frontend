import { createSlice } from "@reduxjs/toolkit";
import {
  uploadStudentData,
  fetchLatestStudentData,
} from "./studentDataThunks.js";

const initialState = {
  latest: null,
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
      });
  },
});

export const { clearError } = studentDataSlice.actions;
export default studentDataSlice.reducer;


