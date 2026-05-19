import api from "../config/api";
import type { RegisterPayload } from "../types/auth";

export const registerUser = async (user: RegisterPayload): Promise<any> => {
  const result = await api.post<any>("/auth/register", user);

  return result.data;
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<any> => {
  const result = await api.post<any>("/auth/login", {
    email,
    password,
  });

  return result.data;
};

export const getMe = async (): Promise<any> => {
  const result = await api.get<any>("/auth/me");

  return result.data;
};
