import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../utils/apiClient.js";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password,
        rememberMe,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const signup = createAsyncThunk(
  "auth/signup",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/signup", {
        name,
        email,
        password,
      });

      // If signup is successful but doesn't return token,
      // automatically log in the user
      if (response.data.success && !response.data.token) {
        // Auto-login after signup
        const loginResponse = await apiClient.post("/auth/login", {
          email,
          password,
          rememberMe: false,
        });
        return loginResponse.data;
      }

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Signup failed. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/users/me");
      return response.data.user;
    } catch (error) {
      // If token is invalid, clear it
      localStorage.removeItem("token");
      const errorMessage =
        error.response?.data?.message || error.message || "Session expired";
      return rejectWithValue(errorMessage);
    }
  }
);

export const verifyLoginOtp = createAsyncThunk(
  "auth/verifyLoginOtp",
  async ({ otpCode, otpToken, rememberMe }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/verify-otp", {
        otpCode,
        otpToken,
        rememberMe,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "OTP verification failed. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const resendLoginOtp = createAsyncThunk(
  "auth/resendLoginOtp",
  async ({ otpToken }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/resend-otp", {
        otpToken,
      });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to resend verification code.";
      return rejectWithValue(errorMessage);
    }
  }
);


