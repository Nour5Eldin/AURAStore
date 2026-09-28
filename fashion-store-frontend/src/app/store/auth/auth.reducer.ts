import { createReducer, on } from "@ngrx/store";
import { AuthState, initialAuthState } from "./auth.state";
import * as AuthActions from "./auth.actions";

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.register, state => ({
    ...state,
    loading: true,
    error:   null,
  })),

  on(AuthActions.registerSuccess, (state, { result }) => ({
    ...state,
    user:       result.user,
    isLoggedIn: true,
    isAdmin:    result.user.role === "admin",
    loading:    false,
    error:      null,
  })),

  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),


  on(AuthActions.login, state => ({
    ...state,
    loading: true,
    error:   null,
  })),

  on(AuthActions.loginSuccess, (state, { result }) => ({
    ...state,
    user:       result.user,
    isLoggedIn: true,
    isAdmin:    result.user.role === "admin",
    loading:    false,
    error:      null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),


  on(AuthActions.logout, () => ({
    ...initialAuthState,
  })),


  on(AuthActions.loadUser, state => ({
    ...state,
    loading: true,
  })),

  on(AuthActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    user,
    isLoggedIn: true,
    isAdmin:    user.role === "admin",
    loading:    false,
    initialized: true,
  })),

  on(AuthActions.loadUserFailure, state => ({
    // If the user was already logged in (e.g. transient network error),
    // preserve their role so AdminGuard doesn't redirect them to "/"
    // which would destroy the component mid-request (loading = true forever).
    ...(state.isLoggedIn ? state : initialAuthState),
    initialized: true,
    loading: false,
  })),

  on(AuthActions.updateProfileSuccess, (state, { user }) => ({
    ...state,
    user,
  })),


  on(AuthActions.clearAuthError, state => ({
    ...state,
    error: null,
  })),
);