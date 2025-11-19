import { createSlice } from "@reduxjs/toolkit";
import {
  login,
  signup,
  fetchMe,
  verifyLoginOtp,
  resendLoginOtp,
} from "./authThunks.js";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  pendingUser: null,
  otpToken: null,
  pendingRememberMe: false,
  otpRequired: false,
  otpLastSentAt: null,
  status: "idle",
  otpVerificationStatus: "idle",
  otpResendStatus: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.otpRequired = false;
      state.pendingUser = null;
      state.otpToken = null;
      state.pendingRememberMe = false;
      state.otpLastSentAt = null;
      state.error = null;
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.pendingUser = null;
      state.otpToken = null;
      state.pendingRememberMe = false;
      state.otpLastSentAt = null;
      state.otpRequired = false;
      state.status = "idle";
      state.otpVerificationStatus = "idle";
      state.otpResendStatus = "idle";
      state.error = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;

        const { token, user, otpToken, otpRequired } = action.payload || {};

        if (token && !otpRequired && user) {
          state.user = user;
          state.token = token;
          state.otpRequired = false;
          if (token) {
            localStorage.setItem("token", token);
          }
          state.pendingUser = null;
          state.otpToken = null;
          state.pendingRememberMe = false;
          state.otpLastSentAt = null;
          return;
        }

        state.pendingUser = user || null;
        state.otpToken = otpToken || null;
        state.user = null;
        state.token = null;
        state.otpRequired = Boolean(otpToken || otpRequired);
        state.pendingRememberMe = action.meta.arg?.rememberMe ?? false;
        state.otpLastSentAt = Date.now();
        localStorage.removeItem("token");
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload || action.error?.message || "Login failed";
        state.pendingUser = null;
        state.otpToken = null;
        state.pendingRememberMe = false;
        state.otpLastSentAt = null;
        state.otpRequired = false;
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        const { token, user, otpToken, otpRequired } = action.payload || {};

        if (token && user) {
          state.user = user;
          state.token = token;
          state.otpRequired = false;
          if (token) {
            localStorage.setItem("token", token);
          }
          return;
        }

        if (otpToken || otpRequired) {
          state.pendingUser = user || null;
          state.otpToken = otpToken || null;
          state.otpRequired = true;
          state.pendingRememberMe = false;
          state.otpLastSentAt = Date.now();
          localStorage.removeItem("token");
        }
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload || action.error?.message || "Signup failed";
      })
      // Verify OTP
      .addCase(verifyLoginOtp.pending, (state) => {
        state.otpVerificationStatus = "loading";
        state.error = null;
      })
      .addCase(verifyLoginOtp.fulfilled, (state, action) => {
        state.otpVerificationStatus = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.otpRequired = false;
        state.pendingUser = null;
        state.otpToken = null;
        state.pendingRememberMe = false;
        state.otpLastSentAt = null;
        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        } else {
          localStorage.removeItem("token");
        }
      })
      .addCase(verifyLoginOtp.rejected, (state, action) => {
        state.otpVerificationStatus = "failed";
        state.error =
          action.payload || action.error?.message || "OTP verification failed";
      })
      // Resend OTP
      .addCase(resendLoginOtp.pending, (state) => {
        state.otpResendStatus = "loading";
        state.error = null;
      })
      .addCase(resendLoginOtp.fulfilled, (state, action) => {
        state.otpResendStatus = "succeeded";
        if (action.payload.user) {
          state.pendingUser = action.payload.user;
        }
        state.otpToken = action.payload.otpToken || state.otpToken;
        state.otpLastSentAt = Date.now();
      })
      .addCase(resendLoginOtp.rejected, (state, action) => {
        state.otpResendStatus = "failed";
        state.error =
          action.payload || action.error?.message || "Failed to resend OTP";
      })
      // Fetch me
      .addCase(fetchMe.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.status = "failed";
        state.token = null;
        state.error =
          action.payload || action.error?.message || "Session expired";
        localStorage.removeItem("token");
      });
  },
});

export const { setCredentials, clearAuth } = authSlice.actions;
export default authSlice.reducer;


