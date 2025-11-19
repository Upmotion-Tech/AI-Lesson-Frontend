import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../utils/apiClient.js";

export const uploadCurriculum = createAsyncThunk(
  "curriculum/upload",
  async ({ file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post("/curriculum/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // After successful upload, fetch the full curriculum
      const latestResponse = await apiClient.get("/curriculum/latest");

      return {
        ...response.data,
        curriculum:
          latestResponse.data.curriculum || response.data.curriculum,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload curriculum"
      );
    }
  }
);

export const fetchLatestCurriculum = createAsyncThunk(
  "curriculum/fetchLatest",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/curriculum/latest");
      return response.data.curriculum;
    } catch (error) {
      if (error.response?.status === 404) {
        return null; // No curriculum uploaded yet
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch curriculum"
      );
    }
  }
);


