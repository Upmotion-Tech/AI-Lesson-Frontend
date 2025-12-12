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

      // After successful upload, fetch all student data to update the list
      const allResponse = await apiClient.get("/students");

      return {
        ...response.data,
        studentData:
          allResponse.data.studentData?.[0] || response.data.studentData,
        studentDataList: allResponse.data.studentData,
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

export const fetchAllStudentData = createAsyncThunk(
  "studentData/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/students");
      return response.data.studentData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch student data"
      );
    }
  }
);

export const deleteStudentData = createAsyncThunk(
  "studentData/delete",
  async (studentDataId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/students/${studentDataId}`);
      return studentDataId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete student data"
      );
    }
  }
);

export const fetchStudentDataById = createAsyncThunk(
  "studentData/fetchById",
  async (studentDataId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/students/${studentDataId}`);
      return response.data.studentData;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch student data"
      );
    }
  }
);


