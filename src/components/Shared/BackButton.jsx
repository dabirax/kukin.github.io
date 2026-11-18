import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const baseClass =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#1ABC9C] text-[#1ABC9C] transition hover:bg-[#1ABC9C]/10 active:scale-95";

const BackButton = ({ to, label = "Go back", className = "" }) => {
  const navigate = useNavigate();
  const classes = `${baseClass} ${className}`.trim();

  if (to) {
    return (
      <Link to={to} aria-label={label} title={label} className={classes}>
        <ArrowLeft className="h-5 w-5" />
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      aria-label={label}
      title={label}
      className={classes}
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
};

export default BackButton;
