import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../utils/apiClient.js";

export const generateLesson = createAsyncThunk(
  "lessons/generate",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/lessons/generate", formData);
      return response.data.lessonPlan;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to generate lesson plan"
      );
    }
  }
);

export const fetchLessonPlan = createAsyncThunk(
  "lessons/fetchOne",
  async (lessonId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/lessons/${lessonId}`);
      return response.data.lessonPlan;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch lesson plan"
      );
    }
  }
);

export const fetchAllLessonPlans = createAsyncThunk(
  "lessons/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/lessons");
      return response.data.lessonPlans;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch lesson plans"
      );
    }
  }
);

export const updateLessonPlan = createAsyncThunk(
  "lessons/update",
  async ({ lessonId, updates }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/lessons/${lessonId}`, updates);
      return response.data.lessonPlan;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update lesson plan"
      );
    }
  }
);

export const deleteLessonPlan = createAsyncThunk(
  "lessons/delete",
  async (lessonId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/lessons/${lessonId}`);
      return lessonId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete lesson plan"
      );
    }
  }
);

