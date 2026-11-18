import { Loader2 } from "lucide-react";

const Button = ({
  text,
  bgColor,
  textColor,
  handler = () => {},
  disabled = false,
  loading = false,
  type = "button",
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={handler}
      disabled={isDisabled}
      className={`${bgColor} ${textColor} cursor-pointer hover:scale-105 duration-300 py-2 px-8 rounded-full font-bold relative z-10 capitalize disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100`}
    >
      {loading ? (
        <Loader2 className="inline h-4 w-4 animate-spin align-[-2px] ltr:mr-2" />
      ) : null}
      {text}
    </button>
  );
};
export default Button;
