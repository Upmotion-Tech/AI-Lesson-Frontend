import { createSlice } from "@reduxjs/toolkit";
import {
  uploadCurriculum,
  fetchLatestCurriculum,
  fetchAllCurricula,
  deleteCurriculum,
  fetchCurriculumById,
} from "./curriculumThunks.js";

const initialState = {
  latest: null,
  current: null, // Currently viewed curriculum
  list: [], // All curricula
  status: "idle",
  uploadStatus: "idle",
  error: null,
};

const curriculumSlice = createSlice({
  name: "curriculum",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetUploadStatus: (state) => {
      state.uploadStatus = "idle";
      state.error = null;
    },
    clearCurrent: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload curriculum
      .addCase(uploadCurriculum.pending, (state) => {
        state.uploadStatus = "loading";
        state.error = null;
      })
      .addCase(uploadCurriculum.fulfilled, (state, action) => {
        state.uploadStatus = "succeeded";
        state.error = null;
        if (action.payload.curriculum) {
          state.latest = action.payload.curriculum;
        }
        // Update list if curricula are provided
        if (action.payload.curricula) {
          state.list = action.payload.curricula;
        }
      })
      .addCase(uploadCurriculum.rejected, (state, action) => {
        state.uploadStatus = "failed";
        state.error = action.payload || action.error?.message || "Upload failed";
      })
      // Fetch latest curriculum
      .addCase(fetchLatestCurriculum.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLatestCurriculum.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.latest = action.payload;
      })
      .addCase(fetchLatestCurriculum.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to fetch curriculum";
      })
      // Fetch all curricula
      .addCase(fetchAllCurricula.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllCurricula.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
        // Update latest if list is not empty
        if (action.payload.length > 0) {
          state.latest = action.payload[0];
        }
      })
      .addCase(fetchAllCurricula.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to fetch curricula";
      })
      // Delete curriculum
      .addCase(deleteCurriculum.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCurriculum.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = state.list.filter((c) => c._id !== action.payload);
        // Update latest if deleted was the latest
        if (state.latest?._id === action.payload) {
          state.latest = state.list.length > 0 ? state.list[0] : null;
        }
      })
      .addCase(deleteCurriculum.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to delete curriculum";
      })
      // Fetch curriculum by ID
      .addCase(fetchCurriculumById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCurriculumById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.current = action.payload;
      })
      .addCase(fetchCurriculumById.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to fetch curriculum";
      });
  },
});

export const { clearError, resetUploadStatus, clearCurrent } =
  curriculumSlice.actions;
export default curriculumSlice.reducer;
