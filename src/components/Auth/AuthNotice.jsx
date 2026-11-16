import { AlertCircle, CheckCircle2 } from "lucide-react";

const AuthNotice = ({ message, tone = "success" }) => {
  if (!message) return null;

  const isError = tone === "error";
  const Icon = isError ? AlertCircle : CheckCircle2;

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
        isError
          ? "bg-red-500/10 text-red-700 ring-1 ring-red-500/30 dark:text-red-300"
          : "bg-[#1ABC9C]/10 text-emerald-800 ring-1 ring-[#1ABC9C]/30 dark:text-[#1ABC9C]"
      }`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default AuthNotice;
