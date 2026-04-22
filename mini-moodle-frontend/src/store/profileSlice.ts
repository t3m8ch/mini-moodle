import { createSlice } from '@reduxjs/toolkit';
import type { ApiErrorResponse } from '../api/client';
import type { UserProfile } from '../types/user';
import { sessionExpired } from './userSlice';
import { fetchProfileData, logoutUser, saveProfileData } from './thunks';

export type ResourceStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface ProfileState {
  profile: UserProfile | null;
  status: ResourceStatus;
  error: ApiErrorResponse | null;
}

const initialState: ProfileState = {
  profile: null,
  status: 'idle',
  error: null,
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProfileData.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchProfileData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? null;
      })
      .addCase(saveProfileData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(saveProfileData.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.status = 'succeeded';
      })
      .addCase(saveProfileData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? null;
      })
      .addCase(logoutUser.fulfilled, () => initialState)
      .addCase(sessionExpired, () => initialState);
  },
});

export const profileReducer = profileSlice.reducer;
