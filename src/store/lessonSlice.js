import { createSlice } from "@reduxjs/toolkit";
import { generateLesson } from "./lessonThunks.js";

const initialState = {
  generated: null,
  status: "idle",
  error: null,
};

const lessonSlice = createSlice({
  name: "lessons",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearGenerated: (state) => {
      state.generated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateLesson.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(generateLesson.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.generated = action.payload;
      })
      .addCase(generateLesson.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to generate lesson";
      });
  },
});

export const { clearError, clearGenerated } = lessonSlice.actions;
export default lessonSlice.reducer;


