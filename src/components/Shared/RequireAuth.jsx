import { Loader2, LockKeyhole } from "lucide-react";
import { useAuth } from "../../auth/useAuth.js";

const RequireAuth = ({
  children,
  title = "Sign in to continue",
  description = "This page is only available to signed-in Kukin members.",
}) => {
  const { isAuthenticated, initializing, openAuth } = useAuth();

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
            <LockKeyhole className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-extrabold">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-[#CED4DA]/70">
            {description}
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

  return children;
};

export default RequireAuth;
