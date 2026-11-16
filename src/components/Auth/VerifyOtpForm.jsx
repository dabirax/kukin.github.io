import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import AuthNotice from "./AuthNotice.jsx";
import OtpInput from "./OtpInput.jsx";
import { useAuth } from "../../auth/useAuth.js";
import { useGlobalContext } from "../../useGlobalContext.js";

const VerifyOtpForm = ({ mode = "signup" }) => {
  const {
    modal,
    verifySignupOtp,
    verifyResetOtp,
    resendSignupOtp,
    forgotPassword,
    setView,
  } = useAuth();
  const { notify } = useGlobalContext();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendIn, setResendIn] = useState(60);

  const isSignup = mode === "signup";
  const email = modal.email || "";

  useEffect(() => {
    if (resendIn <= 0) return undefined;

    const timer = window.setInterval(() => {
      setResendIn((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendIn]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (otp.length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (isSignup) {
        await verifySignupOtp({ email, otp });
        notify("Email verified. You can now sign in.");
      } else {
        await verifyResetOtp({ email, otp });
      }
    } catch (err) {
      setError(err.message || "Unable to verify that code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendIn > 0 || !email) return;

    setResending(true);
    setError("");

    try {
      if (isSignup) {
        await resendSignupOtp(email);
      } else {
        await forgotPassword(email);
      }

      setOtp("");
      setResendIn(60);
      notify("A new code has been sent.");
    } catch (err) {
      setError(err.message || "Unable to send another code.");
      if (err.payload?.retryAfter) {
        setResendIn(Number(err.payload.retryAfter));
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <p className="text-center text-sm leading-relaxed text-slate-600 dark:text-[#CED4DA]/70">
        {isSignup
          ? "Enter the verification code we sent to"
          : "Enter the password reset code we sent to"}{" "}
        <span className="font-semibold text-slate-800 dark:text-[#CED4DA]">
          {email || "your email"}
        </span>
        .
      </p>

      {modal.notice ? <AuthNotice message={modal.notice} /> : null}
      {error ? <AuthNotice message={error} tone="error" /> : null}

      <OtpInput value={otp} onChange={setOtp} disabled={loading} />

      <button
        type="submit"
        disabled={loading || otp.length !== 6}
        className="flex items-center justify-center gap-2 rounded-full bg-[#1ABC9C] px-6 py-3 font-bold text-white transition hover:scale-[1.02] hover:bg-[#16a085] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
        {loading ? "Verifying..." : "Verify code"}
      </button>

      <div className="flex flex-col items-center gap-2 text-sm">
        <button
          type="button"
          onClick={handleResend}
          disabled={resendIn > 0 || resending || !email}
          className="font-semibold text-[#12957c] transition hover:text-[#1ABC9C] disabled:cursor-not-allowed disabled:opacity-50 dark:text-[#1ABC9C]"
        >
          {resending
            ? "Sending..."
            : resendIn > 0
              ? `Resend code in ${resendIn}s`
              : "Resend code"}
        </button>

        <button
          type="button"
          onClick={() =>
            setView(isSignup ? "signup" : "forgot", {
              email: isSignup ? email : "",
            })
          }
          className="text-slate-600 underline-offset-2 transition hover:text-[#1ABC9C] hover:underline dark:text-[#CED4DA]/60"
        >
          {isSignup ? "Change email" : "Use a different email"}
        </button>
      </div>
    </form>
  );
};

export default VerifyOtpForm;
