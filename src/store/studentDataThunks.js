import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../utils/apiClient.js";

export const uploadStudentData = createAsyncThunk(
  "studentData/upload",
  async ({ file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post("/students/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // After successful upload, fetch the full student data
      const latestResponse = await apiClient.get("/students/latest");

      return {
        ...response.data,
        studentData:
          latestResponse.data.studentData || response.data.studentData,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload student data"
      );
    }
  }
);

export const fetchLatestStudentData = createAsyncThunk(
  "studentData/fetchLatest",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/students/latest");
      return response.data.studentData;
    } catch (error) {
      if (error.response?.status === 404) {
        return null; // No student data uploaded yet
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch student data"
      );
    }
  }
);


