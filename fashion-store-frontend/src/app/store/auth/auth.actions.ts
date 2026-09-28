import { createAction, props } from "@ngrx/store";
import { User, AuthResult } from "../../core/models/api-response.model";

const PREFIX = "[Auth]";

export const register = createAction(
  `${PREFIX} Register`,
  props<{
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword?: string;
    gender?: "male" | "female";
    emailConsent?: boolean;
    guestCart?: any[];
  }>()
);

export const registerSuccess = createAction(
  `${PREFIX} Register Success`,
  props<{ result: AuthResult }>()
);

export const registerFailure = createAction(
  `${PREFIX} Register Failure`,
  props<{ error: string }>()
);

export const login = createAction(
  `${PREFIX} Login`,
  props<{ email: string; password: string; guestCart?: any[] }>()
);

export const loginSuccess = createAction(
  `${PREFIX} Login Success`,
  props<{ result: AuthResult }>()
);

export const loginFailure = createAction(
  `${PREFIX} Login Failure`,
  props<{ error: string }>()
);


export const logout = createAction(`${PREFIX} Logout`);

export const loadUser = createAction(`${PREFIX} Load User`);

export const loadUserSuccess = createAction(
  `${PREFIX} Load User Success`,
  props<{ user: User }>()
);

export const loadUserFailure = createAction(
  `${PREFIX} Load User Failure`
);

export const updateProfileSuccess = createAction(
  `${PREFIX} Update Profile Success`,
  props<{ user: User }>()
);

export const refreshTokenSuccess = createAction(
  `${PREFIX} Refresh Token Success`,
  props<{ accessToken: string }>()
);

export const clearAuthError = createAction(`${PREFIX} Clear Error`);