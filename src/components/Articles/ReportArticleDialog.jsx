import { useEffect, useState } from "react";
import { Flag, Loader2, X } from "lucide-react";
import { reportArticle } from "../../api/articles.js";
import { useGlobalContext } from "../../useGlobalContext.js";
import { REPORT_REASONS } from "./constants.js";

const ReportArticleDialog = ({ article, onClose }) => {
  const { notify } = useGlobalContext();
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const data = await reportArticle(article.id, { reason, details });
      notify(data?.message || "Report submitted");
      onClose();
    } catch (requestError) {
      setError(requestError?.message || "Unable to submit this report.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[900] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-article-title"
        className="w-full max-w-md rounded-3xl bg-[#1E1E2F] p-6 text-[#CED4DA] shadow-2xl ring-1 ring-white/10"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-rose-400/10 text-rose-300">
              <Flag className="h-5 w-5" />
            </div>
            <h2
              id="report-article-title"
              className="text-xl font-extrabold"
            >
              Report article
            </h2>
            <p className="mt-1 text-sm text-[#CED4DA]/60">
              Tell us what is wrong with “{article.title}”.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close report dialog"
            className="rounded-full p-2 text-[#CED4DA]/60 transition hover:bg-white/10 hover:text-[#CED4DA]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="report-reason"
              className="text-sm font-semibold text-[#CED4DA]/75"
            >
              Reason
            </label>
            <select
              id="report-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="rounded-xl border border-white/10 bg-[#05010f] px-4 py-3 text-sm text-[#CED4DA] outline-none focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/25"
            >
              {REPORT_REASONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="report-details"
              className="text-sm font-semibold text-[#CED4DA]/75"
            >
              More details <span className="font-normal">(optional)</span>
            </label>
            <textarea
              id="report-details"
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              maxLength={600}
              rows={4}
              placeholder="Add anything that helps us review this article."
              className="resize-none rounded-xl border border-white/10 bg-[#05010f] px-4 py-3 text-sm text-[#CED4DA] outline-none placeholder:text-[#CED4DA]/35 focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/25"
            />
            <p className="text-right text-xs text-[#CED4DA]/40">
              {details.length}/600
            </p>
          </div>

          {error ? (
            <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {error}
            </p>
          ) : null}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-5 py-2.5 text-sm font-bold text-[#CED4DA]/70 transition hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Flag className="h-4 w-4" />
              )}
              Submit report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportArticleDialog;
