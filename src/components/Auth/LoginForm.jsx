import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import AuthField from "./AuthField.jsx";
import AuthNotice from "./AuthNotice.jsx";
import { useAuth } from "../../auth/useAuth.js";
import { useGlobalContext } from "../../useGlobalContext.js";

const LoginForm = () => {
  const { modal, login, setView } = useAuth();
  const { notify } = useGlobalContext();
  const [email, setEmail] = useState(modal.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const data = await login({ email: email.trim(), password });
      notify(`Welcome back, ${data.user.name.split(" ")[0]}!`);
    } catch (err) {
      if (err.code === "EMAIL_NOT_VERIFIED") {
        setView("verify-signup", {
          email: email.trim(),
          notice: err.message,
        });
      } else {
        setError(err.message || "Unable to sign in.");
        setFieldErrors(err.errors || {});
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {modal.notice ? <AuthNotice message={modal.notice} /> : null}
      {error ? <AuthNotice message={error} tone="error" /> : null}

      <AuthField
        label="Email address"
        id="login-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
        error={fieldErrors.email}
        disabled={loading}
      />

      <AuthField
        label="Password"
        id="login-password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Your password"
        autoComplete="current-password"
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

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setView("forgot", { email: email.trim() })}
          className="text-sm font-semibold text-[#12957c] transition hover:text-[#1ABC9C] dark:text-[#1ABC9C]"
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-1 flex items-center justify-center gap-2 rounded-full bg-[#1ABC9C] px-6 py-3 font-bold text-white transition hover:scale-[1.02] hover:bg-[#16a085] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-center text-sm text-slate-600 dark:text-[#CED4DA]/70">
        New to Kukin?{" "}
        <button
          type="button"
          onClick={() => setView("signup", { email: email.trim() })}
          className="font-bold text-[#12957c] transition hover:text-[#1ABC9C] dark:text-[#1ABC9C]"
        >
          Create an account
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
