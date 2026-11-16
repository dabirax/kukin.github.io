import { useEffect, useRef, useState } from "react";
import { UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../auth/useAuth.js";

export function AccountMenu({ profile }) {
  const { user, isAuthenticated, initializing, openAuth, } = useAuth();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (initializing) {
    return <div className="h-10 w-10 animate-pulse rounded-full bg-slate-700/30" />;
  }

  if (!isAuthenticated) {
    return (
      <button
        type="button"
        onClick={() => openAuth("login")}
        className="flex items-center gap-2 rounded-full border border-[#1ABC9C]/50 px-3 py-2 text-sm font-bold text-[#12957c] transition hover:bg-[#1ABC9C]/10 dark:text-[#1ABC9C]"
      >
        <UserRound className="h-5 w-5" />
        <span className="hidden sm:inline">Sign in</span>
      </button>
    );
  }

  const avatar = user?.avatarUrl || profile;
  const firstName = String(user?.name || "").split(" ")[0] || "Account";
  const initial = String(user?.name || "K").charAt(0).toUpperCase();



  return (
    <div ref={menuRef} className="relative">
      
          <Link
            to="/settings"
        className="flex items-center gap-2 rounded-full border border-white/10 bg-[#CED4DA]/10 py-1 pl-1 pr-2 transition hover:border-[#1ABC9C]/60 active:scale-95 dark:border-[#CED4DA]/10 dark:bg-[#CED4DA]/10 dark:hover:border-[#1ABC9C]/60"
      >
        {avatar ? (
          <img
            src={avatar}
            alt=""
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1ABC9C] text-sm font-black text-white">
            {initial}
          </span>
        )}
        <span className="hidden max-w-24 truncate text-sm font-bold text-slate-300 sm:inline dark:text-[#CED4DA]">
          {firstName}
        </span>
      </Link>

      
    </div>
  );
}
