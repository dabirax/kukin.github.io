import { useContext } from "react";
import { AppContext } from "./contextCore.js";

export const useGlobalContext = () => {
  return useContext(AppContext);
};
