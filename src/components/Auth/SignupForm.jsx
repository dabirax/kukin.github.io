import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import AuthField from "./AuthField.jsx";
import AuthNotice from "./AuthNotice.jsx";
import { useAuth } from "../../auth/useAuth.js";

const SignupForm = () => {
  const { modal, signup, setView } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: modal.email || "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (form.name.trim().length < 2) {
      nextErrors.name = "Enter your name.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Enter your email address.";
    }

    if (form.password.length < 8) {
      nextErrors.password = "Use at least 8 characters.";
    }

    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
    } catch (err) {
      setError(err.message || "Unable to create your account.");
      setFieldErrors(err.errors || {});
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {error ? <AuthNotice message={error} tone="error" /> : null}

      <AuthField
        label="Full name"
        id="signup-name"
        value={form.name}
        onChange={update("name")}
        placeholder="Ada Okafor"
        autoComplete="name"
        error={fieldErrors.name}
        disabled={loading}
      />

      <AuthField
        label="Email address"
        id="signup-email"
        type="email"
        value={form.email}
        onChange={update("email")}
        placeholder="you@example.com"
        autoComplete="email"
        error={fieldErrors.email}
        disabled={loading}
      />

      <AuthField
        label="Password"
        id="signup-password"
        type={showPassword ? "text" : "password"}
        value={form.password}
        onChange={update("password")}
        placeholder="At least 8 characters"
        autoComplete="new-password"
        error={fieldErrors.password}
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
        label="Confirm password"
        id="signup-confirm-password"
        type={showPassword ? "text" : "password"}
        value={form.confirmPassword}
        onChange={update("confirmPassword")}
        placeholder="Repeat your password"
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
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-slate-600 dark:text-[#CED4DA]/70">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => setView("login", { email: form.email.trim() })}
          className="font-bold text-[#12957c] transition hover:text-[#1ABC9C] dark:text-[#1ABC9C]"
        >
          Sign in
        </button>
      </p>
    </form>
  );
};

export default SignupForm;
