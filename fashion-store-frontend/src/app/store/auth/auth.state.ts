import { User } from "../../core/models/api-response.model";

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  initialized: boolean;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  isLoggedIn: false,
  isAdmin: false,
  initialized: false,
  loading: false,
  error: null,
};