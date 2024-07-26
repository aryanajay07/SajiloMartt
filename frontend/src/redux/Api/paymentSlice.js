import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to initiate payment
export const initiatePayment = createAsyncThunk(
  'payment/initiatePayment',
  async (paymentData, thunkAPI) => {
    try {
      const response = await axios.post('/api/payment/initiate', paymentData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to handle payment callback
export const handlePaymentCallback = createAsyncThunk(
  'payment/handlePaymentCallback',
  async (callbackData, thunkAPI) => {
    try {
      const response = await axios.post('/api/payment/callback', callbackData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    pidx: null,
    payment_url: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(initiatePayment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pidx = action.payload.pidx;
        state.payment_url = action.payload.payment_url;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(handlePaymentCallback.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(handlePaymentCallback.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Handle additional state changes if necessary
      })
      .addCase(handlePaymentCallback.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default paymentSlice.reducer;
