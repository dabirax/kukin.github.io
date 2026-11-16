import { CheckCircle2, X } from "lucide-react";
import { useGlobalContext } from "../../useGlobalContext.js";

const Toaster = () => {
  const { toasts, dismissToast } = useGlobalContext();

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 right-4 z-[900] flex w-[min(20rem,calc(100vw-2rem))] flex-col gap-2"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className="animate-toast-in pointer-events-auto flex items-center gap-3 rounded-xl bg-slate-900/95 px-4 py-3 text-sm font-medium text-[#CED4DA] shadow-2xl ring-1 ring-white/10"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-[#1ABC9C]" />
          <span className="flex-1">{toast.message}</span>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => dismissToast(toast.id)}
            className="text-[#CED4DA]/60 transition hover:text-[#CED4DA]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toaster;
