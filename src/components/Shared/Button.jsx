const Button = ({ text, bgColor, textColor, handler = () => {} }) => {
  return <button onClick={handler} className={`${bgColor} ${textColor} cursor-pointer hover:scale-105 duration-300 py-2 px-8 rounded-full font-bold relative z-10 capitalize`}>{text}</button>;
};
export default Button;
