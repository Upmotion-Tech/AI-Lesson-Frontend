import { createSlice } from "@reduxjs/toolkit";
import {
  generateLesson,
  fetchLessonPlan,
  fetchAllLessonPlans,
  updateLessonPlan,
  deleteLessonPlan,
} from "./lessonThunks.js";

const initialState = {
  current: null, // Currently viewed/edited lesson
  list: [], // All lesson plans
  generated: null, // Last generated lesson
  status: "idle", // idle, loading, succeeded, failed
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
    setCurrent: (state, action) => {
      state.current = action.payload;
    },
    clearCurrent: (state) => {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate lesson
      .addCase(generateLesson.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(generateLesson.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.generated = action.payload;
        state.current = action.payload;
        // Add to list if not already there
        if (!state.list.find((l) => l._id === action.payload._id)) {
          state.list.unshift(action.payload);
        }
      })
      .addCase(generateLesson.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to generate lesson";
      })
      // Fetch single lesson
      .addCase(fetchLessonPlan.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchLessonPlan.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.current = action.payload;
      })
      .addCase(fetchLessonPlan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch lesson plan";
      })
      // Fetch all lessons
      .addCase(fetchAllLessonPlans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllLessonPlans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchAllLessonPlans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to fetch lesson plans";
      })
      // Update lesson
      .addCase(updateLessonPlan.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateLessonPlan.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.current = action.payload;
        // Update in list
        const index = state.list.findIndex((l) => l._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(updateLessonPlan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to update lesson plan";
      })
      // Delete lesson
      .addCase(deleteLessonPlan.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteLessonPlan.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = state.list.filter((l) => l._id !== action.payload);
        if (state.current?._id === action.payload) {
          state.current = null;
        }
      })
      .addCase(deleteLessonPlan.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to delete lesson plan";
      });
  },
});

export const { clearError, clearGenerated, setCurrent, clearCurrent } =
  lessonSlice.actions;
export default lessonSlice.reducer;


