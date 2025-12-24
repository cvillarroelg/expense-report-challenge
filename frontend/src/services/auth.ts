import { http } from "./http";

export interface LoginResponse {
  token: string;
}

export interface User {
  email: string;
}

export const login = (email: string, password: string) =>
  http<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const getMe = () =>
  http<User>("/auth/me");

export const logout = () => {
  localStorage.removeItem("token");
};
