import { useState } from "react";
import { Loader2 } from "lucide-react";
import AuthField from "./AuthField.jsx";
import AuthNotice from "./AuthNotice.jsx";
import { useAuth } from "../../auth/useAuth.js";

const ForgotPasswordForm = () => {
  const { modal, forgotPassword, setView } = useAuth();
  const [email, setEmail] = useState(modal.email || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Enter the email linked to your account.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await forgotPassword(email.trim());
    } catch (err) {
      setError(err.message || "Unable to send a reset code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-[#CED4DA]/70">
        Enter your email and we&apos;ll send you a 6-digit code to reset your
        password.
      </p>

      {error ? <AuthNotice message={error} tone="error" /> : null}

      <AuthField
        label="Email address"
        id="forgot-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-1 flex items-center justify-center gap-2 rounded-full bg-[#1ABC9C] px-6 py-3 font-bold text-white transition hover:scale-[1.02] hover:bg-[#16a085] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        {loading ? "Sending code..." : "Send reset code"}
      </button>

      <button
        type="button"
        onClick={() => setView("login", { email: email.trim() })}
        className="text-center text-sm font-semibold text-[#12957c] transition hover:text-[#1ABC9C] dark:text-[#1ABC9C]"
      >
        Back to sign in
      </button>
    </form>
  );
};

export default ForgotPasswordForm;
