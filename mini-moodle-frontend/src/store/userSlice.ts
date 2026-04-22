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

export type SessionStatus = 'unknown' | 'checking' | 'guest' | 'authenticated';
export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface UserState {
  currentUser: User | null;
  sessionStatus: SessionStatus;
  authActionStatus: RequestStatus;
}

const initialState: UserState = {
  currentUser: null,
  sessionStatus: 'unknown',
  authActionStatus: 'idle',
};

const guestState: UserState = {
  currentUser: null,
  sessionStatus: 'guest',
  authActionStatus: 'idle',
};

function areUsersEqual(left: User | null, right: User) {
  return left !== null && shallowEqual(left, right);
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    sessionExpired() {
      return guestState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.sessionStatus = 'checking';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.currentUser = action.payload.user;
        state.sessionStatus = 'authenticated';
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.currentUser = null;
        state.sessionStatus = 'guest';
      })
      .addCase(loginUser.pending, (state) => {
        state.authActionStatus = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.currentUser = action.payload.user;
        state.sessionStatus = 'authenticated';
        state.authActionStatus = 'succeeded';
      })
      .addCase(loginUser.rejected, (state) => {
        state.authActionStatus = 'failed';
        state.sessionStatus = 'guest';
      })
      .addCase(registerUser.pending, (state) => {
        state.authActionStatus = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.currentUser = action.payload.user;
        state.sessionStatus = 'authenticated';
        state.authActionStatus = 'succeeded';
      })
      .addCase(registerUser.rejected, (state) => {
        state.authActionStatus = 'failed';
        state.sessionStatus = 'guest';
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
      .addCase(logoutUser.fulfilled, () => guestState);
  },
});

export const { sessionExpired } = userSlice.actions;
export const userReducer = userSlice.reducer;
