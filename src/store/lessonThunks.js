import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../utils/apiClient.js";

export const generateLesson = createAsyncThunk(
  "lessons/generate",
  async (_, { rejectWithValue }) => {
    try {
      // Placeholder - will be implemented in Milestone 2
      return {
        message: "Lesson generation will be enabled in the next milestone.",
        implemented: false,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate lesson"
      );
    }
  }
);


