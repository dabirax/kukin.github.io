import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import AuthField from "./AuthField.jsx";
import AuthNotice from "./AuthNotice.jsx";
import { useAuth } from "../../auth/useAuth.js";

const ResetPasswordForm = () => {
  const { modal, resetPassword, setView } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (password.length < 8) {
      nextErrors.newPassword = "Use at least 8 characters.";
    }

    if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setError("");
      return;
    }

    if (!modal.resetToken) {
      setError("Your reset session is missing. Request a new code.");
      return;
    }

    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      await resetPassword({
        resetToken: modal.resetToken,
        newPassword: password,
        confirmPassword,
      });
    } catch (err) {
      setError(err.message || "Unable to reset your password.");
      setFieldErrors(err.errors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {modal.notice ? <AuthNotice message={modal.notice} /> : null}
      {error ? <AuthNotice message={error} tone="error" /> : null}

      <AuthField
        label="New password"
        id="reset-password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="At least 8 characters"
        autoComplete="new-password"
        error={fieldErrors.newPassword}
        disabled={loading}
        trailing={
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="text-slate-500 transition hover:text-[#1ABC9C] dark:text-[#CED4DA]/60"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
      />

      <AuthField
        label="Confirm new password"
        id="reset-confirm-password"
        type={showPassword ? "text" : "password"}
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        placeholder="Repeat your new password"
        autoComplete="new-password"
        error={fieldErrors.confirmPassword}
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-1 flex items-center justify-center gap-2 rounded-full bg-[#1ABC9C] px-6 py-3 font-bold text-white transition hover:scale-[1.02] hover:bg-[#16a085] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        {loading ? "Resetting..." : "Reset password"}
      </button>

      <button
        type="button"
        onClick={() => setView("forgot", { email: modal.email })}
        className="text-center text-sm font-semibold text-[#12957c] transition hover:text-[#1ABC9C] dark:text-[#1ABC9C]"
      >
        Request a new code
      </button>
    </form>
  );
};

export default ResetPasswordForm;
