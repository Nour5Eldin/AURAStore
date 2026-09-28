import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth.state";

export const selectAuthState = createFeatureSelector<AuthState>("auth");

export const selectUser        = createSelector(selectAuthState, s => s.user);
export const selectIsLoggedIn  = createSelector(selectAuthState, s => s.isLoggedIn);
export const selectIsAdmin     = createSelector(selectAuthState, s => s.isAdmin);
export const selectAuthInitialized = createSelector(selectAuthState, s => s.initialized);
export const selectAuthLoading = createSelector(selectAuthState, s => s.loading);
export const selectAuthError   = createSelector(selectAuthState, s => s.error);

export const selectUserName    = createSelector(selectUser, u => u?.name || "Guest");
export const selectUserAvatar  = createSelector(selectUser, u => u?.avatar || null);
export const selectUserRole    = createSelector(selectUser, u => u?.role || null);