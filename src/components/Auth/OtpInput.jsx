import { useRef } from "react";

const OtpInput = ({ value, onChange, disabled = false }) => {
  const refs = useRef([]);

  const digits = Array.from({ length: 6 }, (_, index) => value[index] || "");

  const focusAt = (index) => {
    refs.current[index]?.focus();
    refs.current[index]?.select();
  };

  const updateAt = (index, digit) => {
    const next = [...digits];
    next[index] = digit;
    onChange(next.join("").replace(/\D/g, "").slice(0, 6));
  };

  const handleChange = (index, rawValue) => {
    const digit = rawValue.replace(/\D/g, "").slice(-1);
    updateAt(index, digit);

    if (digit && index < 5) {
      focusAt(index + 1);
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      if (digits[index]) {
        updateAt(index, "");
        return;
      }

      if (index > 0) {
        event.preventDefault();
        updateAt(index - 1, "");
        focusAt(index - 1);
      }
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusAt(index - 1);
    }

    if (event.key === "ArrowRight" && index < 5) {
      event.preventDefault();
      focusAt(index + 1);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    onChange(pasted);
    focusAt(Math.min(pasted.length, 5));
  };

  return (
    <div className="flex justify-between gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          value={digit}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          onFocus={(event) => event.target.select()}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          disabled={disabled}
          aria-label={`Verification code digit ${index + 1}`}
          className="h-12 w-full rounded-xl border border-slate-400/40 bg-white/80 text-center text-xl font-bold text-slate-900 outline-none transition focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/30 disabled:opacity-60 sm:h-14 dark:border-white/10 dark:bg-[#05010f] dark:text-[#CED4DA]"
        />
      ))}
    </div>
  );
};

export default OtpInput;
