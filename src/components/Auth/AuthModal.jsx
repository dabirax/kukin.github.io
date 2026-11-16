import { useEffect } from "react";
import { X } from "lucide-react";
import { MdFastfood } from "react-icons/md";
import { useAuth } from "../../auth/useAuth.js";
import LoginForm from "./LoginForm.jsx";
import SignupForm from "./SignupForm.jsx";
import VerifyOtpForm from "./VerifyOtpForm.jsx";
import ForgotPasswordForm from "./ForgotPasswordForm.jsx";
import ResetPasswordForm from "./ResetPasswordForm.jsx";

const titles = {
  login: "Welcome back",
  signup: "Create your account",
  "verify-signup": "Verify your email",
  forgot: "Forgot password?",
  "verify-reset": "Enter reset code",
  reset: "Choose a new password",
};

const AuthModal = () => {
  const { modal, closeAuth } = useAuth();

  useEffect(() => {
    if (!modal.isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeAuth();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modal.isOpen, closeAuth]);

  if (!modal.isOpen) return null;

  let content = <LoginForm />;

  if (modal.view === "signup") content = <SignupForm />;
  if (modal.view === "verify-signup") content = <VerifyOtpForm mode="signup" />;
  if (modal.view === "forgot") content = <ForgotPasswordForm />;
  if (modal.view === "verify-reset") content = <VerifyOtpForm mode="reset" />;
  if (modal.view === "reset") content = <ResetPasswordForm />;

  return (
    <div
      className="fixed inset-0 z-[950] flex items-center justify-center bg-slate-950/60 p-4 font-poppins backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeAuth();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-[#CED4DA] p-6 shadow-2xl sm:p-8 dark:bg-[#1E1E2F]"
      >
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex font-serif italic font-bold text-[#F39C12] text-3xl">
              KUKIN
              <span className="text-[#1ABC9C]">
                <MdFastfood />
              </span>
            </div>
            <button
              type="button"
              onClick={closeAuth}
              aria-label="Close sign-in dialog"
              className="rounded-full p-2 text-red-500 transition hover:bg-red-500/10"
            >
              <X className="h-7 w-7" strokeWidth={3} />
            </button>
          </div>
          <h2
            id="auth-modal-title"
            className="text-2xl font-extrabold text-slate-800 sm:text-3xl dark:text-[#CED4DA]"
          >
            {titles[modal.view] || "Welcome"}
          </h2>
        </div>

        {content}
      </div>
    </div>
  );
};

export default AuthModal;
