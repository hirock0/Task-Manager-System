import { createContext, useContext, useState } from "react";
const myContext = createContext();
export const useContextApi = () => {
  return useContext(myContext);
};
const ContextApiProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const values = {
    loading,
    setLoading,
  };
  return <myContext.Provider value={values}>{children}</myContext.Provider>;
};

export default ContextApiProvider;
