import { createSlice } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';
import type { User } from '../types/user';
import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  saveProfileData,
} from './thunks';

export type UserStatus = 'idle' | 'loading' | 'authenticated' | 'guest';
export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface UserState {
  currentUser: User | null;
  status: UserStatus;
  authRequestStatus: RequestStatus;
}

const initialState: UserState = {
  currentUser: null,
  status: 'idle',
  authRequestStatus: 'idle',
};

function areUsersEqual(left: User | null, right: User) {
  return left !== null && shallowEqual(left, right);
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.currentUser = action.payload.user;
        state.status = 'authenticated';
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.currentUser = null;
        state.status = 'guest';
      })
      .addCase(loginUser.pending, (state) => {
        state.authRequestStatus = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.currentUser = action.payload.user;
        state.status = 'authenticated';
        state.authRequestStatus = 'succeeded';
      })
      .addCase(loginUser.rejected, (state) => {
        state.authRequestStatus = 'failed';
        state.status = 'guest';
      })
      .addCase(registerUser.pending, (state) => {
        state.authRequestStatus = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.currentUser = action.payload.user;
        state.status = 'authenticated';
        state.authRequestStatus = 'succeeded';
      })
      .addCase(registerUser.rejected, (state) => {
        state.authRequestStatus = 'failed';
        state.status = 'guest';
      })
      .addCase(saveProfileData.fulfilled, (state, action) => {
        const nextUser: User = {
          id: action.payload.id,
          email: action.payload.email,
          fullName: action.payload.fullName,
          avatarFallback: action.payload.avatarFallback,
        };

        if (!areUsersEqual(state.currentUser, nextUser)) {
          state.currentUser = nextUser;
        }
      })
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

export const userReducer = userSlice.reducer;
