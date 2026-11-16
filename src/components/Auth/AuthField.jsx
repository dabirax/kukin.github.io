export const inputClass =
  "w-full rounded-xl border border-slate-400/40 bg-white/80 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#05010f] dark:text-[#CED4DA] dark:placeholder:text-[#CED4DA]/40";

const AuthField = ({
  label,
  id,
  error,
  hint,
  trailing,
  className = "",
  labelClassName = "text-slate-700 dark:text-[#CED4DA]",
  ...inputProps
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className={`text-sm font-semibold ${labelClassName}`}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className={`${inputClass} ${trailing ? "pr-12" : ""} ${className}`}
          aria-invalid={Boolean(error)}
          {...inputProps}
        />
        {trailing ? (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {trailing}
          </div>
        ) : null}
      </div>
      {error ? (
        <p className="text-xs font-medium text-red-600 dark:text-red-400">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-600 dark:text-[#CED4DA]/60">{hint}</p>
      ) : null}
    </div>
  );
};

export default AuthField;
