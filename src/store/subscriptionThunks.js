import { createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../utils/apiClient.js";

export const fetchPlans = createAsyncThunk("subscription/fetchPlans", async (_, { rejectWithValue }) => {
  try {
    const res = await apiClient.get("/packages");
    return res.data.plans;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to load plans");
  }
});

export const startCheckout = createAsyncThunk("subscription/startCheckout", async (priceId, { rejectWithValue }) => {
  try {
    const res = await apiClient.post("/packages/checkout", { priceId });
    return res.data.url;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to start checkout");
  }
});

export const openBillingPortal = createAsyncThunk("subscription/openBillingPortal", async (_, { rejectWithValue }) => {
  try {
    const res = await apiClient.post("/packages/portal");
    return res.data.url;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to open billing portal");
  }
});
