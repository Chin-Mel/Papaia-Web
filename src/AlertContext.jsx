import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within AlertProvider");
  }
  return context;
};

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({ type: "", message: "" });

  const showAlert = (message, type = "info", duration = 3000) => {
    setAlert({ message, type, duration });
  };

  const hideAlert = () => {
    setAlert({ type: "", message: "" });
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert, alert }}>
      {children}
    </AlertContext.Provider>
  );
};
