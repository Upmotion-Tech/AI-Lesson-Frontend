import { createSlice } from "@reduxjs/toolkit";
import { login, signup, fetchMe, verifyLoginOtp, resendLoginOtp } from "./authThunks.js";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  status: "idle",
  error: null,
  otpRequired: false,
  otpToken: null,
  pendingUser: null,
  pendingRememberMe: false,
  otpVerificationStatus: "idle",
  otpResendStatus: "idle",
  otpLastSentAt: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      if (token) {
        localStorage.setItem("token", token);
      }
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      state.otpRequired = false;
      state.otpToken = null;
      state.pendingUser = null;
      state.pendingRememberMe = false;
      state.otpVerificationStatus = "idle";
      state.otpResendStatus = "idle";
      state.otpLastSentAt = null;
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
        if (action.payload.otpRequired) {
          // OTP required - store pending state
          state.otpRequired = true;
          state.otpToken = action.payload.otpToken;
          state.pendingUser = action.payload.user;
          state.pendingRememberMe = action.payload.rememberMe || false;
          state.otpLastSentAt = Date.now();
        } else {
          // Direct login success
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.otpRequired = false;
          if (action.payload.token) {
            localStorage.setItem("token", action.payload.token);
          }
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Login failed";
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Signup failed";
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
        localStorage.removeItem("token");
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
        state.otpToken = null;
        state.pendingUser = null;
        state.pendingRememberMe = false;
        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        }
      })
      .addCase(verifyLoginOtp.rejected, (state, action) => {
        state.otpVerificationStatus = "failed";
        state.error = action.payload || "OTP verification failed";
      })
      // Resend OTP
      .addCase(resendLoginOtp.pending, (state) => {
        state.otpResendStatus = "loading";
        state.error = null;
      })
      .addCase(resendLoginOtp.fulfilled, (state, action) => {
        state.otpResendStatus = "succeeded";
        state.otpToken = action.payload.otpToken;
        state.otpLastSentAt = Date.now();
      })
      .addCase(resendLoginOtp.rejected, (state, action) => {
        state.otpResendStatus = "failed";
        state.error = action.payload || "Failed to resend OTP";
      });
  },
});

export const { setCredentials, clearAuth } = authSlice.actions;
export default authSlice.reducer;


