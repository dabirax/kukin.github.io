import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Loader2,
  LogOut,
  Mail,
  UserRound,
} from "lucide-react";
import AuthField from "../Auth/AuthField.jsx";
import AuthNotice from "../Auth/AuthNotice.jsx";
import BackButton from "../Shared/BackButton.jsx";
import { useAuth } from "../../auth/useAuth.js";
import { useGlobalContext } from "../../useGlobalContext.js";

const Settings = () => {
  const {
    user,
    isAuthenticated,
    initializing,
    openAuth,
    logout,
    updateProfile,
    updateAvatar,
    updatePassword,
  } = useAuth();
  const { notify } = useGlobalContext();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || "");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  if (initializing) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center text-[#CED4DA]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1ABC9C]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-16 text-[#CED4DA]">
        <div className="mx-auto max-w-lg rounded-3xl bg-[#1E1E2F] p-8 text-center shadow-2xl ring-1 ring-white/10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1ABC9C]/15 text-[#1ABC9C]">
            <UserRound className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-extrabold">Sign in to manage your account</h1>
          <p className="mt-2 text-sm text-[#CED4DA]/70">
            Update your profile, upload an avatar, and manage your password.
          </p>
          <button
            type="button"
            onClick={() => openAuth("login")}
            className="mt-6 rounded-full bg-[#1ABC9C] px-8 py-3 font-bold text-white transition hover:scale-105 hover:bg-[#16a085]"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  const avatar = avatarPreview || user.avatarUrl;
  const initial = String(user.name || "K").charAt(0).toUpperCase();


  const handleNameSubmit = async (event) => {
    event.preventDefault();

    if (name.trim().length < 2) {
      setNameError("Name must be at least 2 characters.");
      return;
    }

    setNameLoading(true);
    setNameError("");

    try {
      await updateProfile({ name: name.trim() });
      notify("Profile updated");
    } catch (error) {
      setNameError(error.message || "Unable to update your profile.");
    } finally {
      setNameLoading(false);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setProfileError("Choose an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfileError("Image must be 5MB or smaller.");
      return;
    }

    const preview = URL.createObjectURL(file);
    setAvatarPreview(preview);
    setProfileError("");
    setAvatarLoading(true);

    try {
      await updateAvatar(file);
      notify("Avatar updated");
      setAvatarPreview("");
    } catch (error) {
      setProfileError(error.message || "Unable to upload your avatar.");
      setAvatarPreview("");
    } finally {
      setAvatarLoading(false);
    }
  };

  const updatePasswordField = (field) => (event) => {
    setPasswordForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    const errors = {};

    if (user.hasPassword && !passwordForm.currentPassword) {
      errors.currentPassword = "Enter your current password.";
    }

    if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "Use at least 8 characters.";
    }

    if (passwordForm.confirmPassword !== passwordForm.newPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      setPasswordError("");
      return;
    }

    setPasswordLoading(true);
    setPasswordError("");
    setPasswordErrors({});

    try {
      await updatePassword(passwordForm);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      notify("Password updated");
    } catch (error) {
      setPasswordError(error.message || "Unable to update your password.");
      setPasswordErrors(error.errors || {});
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="container pb-8 text-[#CED4DA]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center gap-4">
          <BackButton label="Go back" />
          <div>
            <h1 className="text-3xl font-extrabold sm:text-4xl">Account settings</h1>
                     </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-3xl bg-[#1E1E2F] p-6 shadow-2xl ring-1 ring-white/10">
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="relative">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Your avatar"
                    className="h-28 w-28 rounded-full object-cover ring-2 ring-[#070707]/40"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#1ABC9C] text-4xl font-black text-white ring-2 ring-[#1ABC9C]/40">
                    {initial}
                  </div>
                )}

                {avatarLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-slate-950/60">
                    <Loader2 className="h-7 w-7 animate-spin text-[#1ABC9C]" />
                  </div>
                ) : null}
              </div>

              <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
              <p className="flex items-center gap-1.5 text-sm text-[#CED4DA]/60">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>

             

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarLoading}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#1ABC9C]/50 px-5 py-2 text-sm font-bold text-[#1ABC9C] transition hover:bg-[#1ABC9C]/10 disabled:opacity-60"
              >
                {avatarLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
                {avatarLoading ? "Uploading..." : "Change avatar"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            
              {profileError ? (
                <div className="mt-3 w-full text-left">
                  <AuthNotice message={profileError} tone="error" />
                </div>
              ) : null}

              

              <button
                type="button"
                onClick={async () => {
                  await logout();
                  notify("Signed out");
                }}
                className="mt-20 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 font-bold text-red-400 transition hover:bg-red-500/20"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </section>

          <div className="flex flex-col gap-6">
            <section className="rounded-3xl bg-[#1E1E2F] p-6 shadow-2xl ring-1 ring-white/10">
              <h2 className="text-lg font-bold">Profile details</h2>
              

              {nameError ? (
                <div className="mt-4">
                  <AuthNotice message={nameError} tone="error" />
                </div>
              ) : null}

              <form onSubmit={handleNameSubmit} className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <AuthField
                    label="Display name"
                    id="settings-name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    disabled={nameLoading}
                    labelClassName="text-[#CED4DA]/70"
                  />
                </div>
                <button
                  type="submit"
                  disabled={nameLoading}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#1ABC9C] px-6 py-3 font-bold text-white transition hover:bg-[#16a085] disabled:opacity-60"
                >
                  {nameLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Save
                </button>
              </form>

            </section>

            <section className="rounded-3xl bg-[#1E1E2F] p-6 shadow-2xl ring-1 ring-white/10">
              <h2 className="text-lg font-bold">
                {user.hasPassword ? "Change password" : "Set a password"}
              </h2>
             

              {passwordError ? (
                <div className="mt-4">
                  <AuthNotice message={passwordError} tone="error" />
                </div>
              ) : null}

              <form onSubmit={handlePasswordSubmit} className="mt-4 flex flex-col gap-4">
                {user.hasPassword ? (
                  <AuthField
                    label="Current password"
                    id="settings-current-password"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={updatePasswordField("currentPassword")}
                    autoComplete="current-password"
                    error={passwordErrors.currentPassword}
                    disabled={passwordLoading}
                    labelClassName="text-[#CED4DA]/70"
                  />
                ) : null}

                <AuthField
                  label="New password"
                  id="settings-new-password"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={updatePasswordField("newPassword")}
                  autoComplete="new-password"
                  error={passwordErrors.newPassword}
                  disabled={passwordLoading}
                  labelClassName="text-[#CED4DA]/70"
                />

                <AuthField
                  label="Confirm new password"
                  id="settings-confirm-password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={updatePasswordField("confirmPassword")}
                  autoComplete="new-password"
                  error={passwordErrors.confirmPassword}
                  disabled={passwordLoading}
                  labelClassName="text-[#CED4DA]/70"
                />

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#1ABC9C] px-6 py-3 font-bold text-white transition hover:bg-[#16a085] disabled:opacity-60"
                >
                  {passwordLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  {user.hasPassword ? "Update password" : "Set password"}
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
