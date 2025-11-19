import { createSlice } from "@reduxjs/toolkit";
import { uploadCurriculum, fetchLatestCurriculum } from "./curriculumThunks.js";

const initialState = {
  latest: null,
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
        state.error = action.payload || action.error?.message || "Failed to fetch curriculum";
      });
  },
});

export const { clearError, resetUploadStatus } = curriculumSlice.actions;
export default curriculumSlice.reducer;
