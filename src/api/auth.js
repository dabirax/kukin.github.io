import { request } from "./client.js";

export const signup = (payload) =>
  request("/api/auth/signup", {
    method: "POST",
    body: payload,
    auth: false,
  });

export const verifySignupOtp = (payload) =>
  request("/api/auth/signup/verify-otp", {
    method: "POST",
    body: payload,
    auth: false,
  });

export const resendSignupOtp = (payload) =>
  request("/api/auth/signup/resend-otp", {
    method: "POST",
    body: payload,
    auth: false,
  });

export const login = (payload) =>
  request("/api/auth/login", {
    method: "POST",
    body: payload,
    auth: false,
  });

export const logout = () =>
  request("/api/auth/logout", {
    method: "POST",
    auth: true,
  });

export const getMe = () => request("/api/auth/me");

export const updateMe = (payload) =>
  request("/api/auth/me", {
    method: "PATCH",
    body: payload,
  });

export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append("image", file);

  return request("/api/auth/avatar", {
    method: "POST",
    body: formData,
    timeout: 60000,
  });
};

export const changePassword = (payload) =>
  request("/api/auth/password", {
    method: "PATCH",
    body: payload,
  });

export const forgotPassword = (payload) =>
  request("/api/auth/forgot-password", {
    method: "POST",
    body: payload,
    auth: false,
  });

export const verifyResetOtp = (payload) =>
  request("/api/auth/forgot-password/verify-otp", {
    method: "POST",
    body: payload,
    auth: false,
  });

export const resetPassword = (payload) =>
  request("/api/auth/reset-password", {
    method: "POST",
    body: payload,
    auth: false,
  });
