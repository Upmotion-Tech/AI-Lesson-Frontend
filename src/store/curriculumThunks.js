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

      // After successful upload, fetch all curricula to update the list
      const allResponse = await apiClient.get("/curriculum");

      return {
        ...response.data,
        curriculum: allResponse.data.curricula?.[0] || response.data.curriculum,
        curricula: allResponse.data.curricula,
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

export const fetchAllCurricula = createAsyncThunk(
  "curriculum/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/curriculum");
      return response.data.curricula;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch curricula"
      );
    }
  }
);

export const deleteCurriculum = createAsyncThunk(
  "curriculum/delete",
  async (curriculumId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/curriculum/${curriculumId}`);
      return curriculumId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete curriculum"
      );
    }
  }
);

export const fetchCurriculumById = createAsyncThunk(
  "curriculum/fetchById",
  async (curriculumId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/curriculum/${curriculumId}`);
      return response.data.curriculum;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch curriculum"
      );
    }
  }
);


