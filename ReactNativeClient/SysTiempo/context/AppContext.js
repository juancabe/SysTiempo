import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [dataFuera, setDataFuera] = useState(null);
  const [dataDentro, setDataDentro] = useState(null);

  return (
    <AppContext.Provider
      value={{
        dataFuera,
        setDataFuera,
        dataDentro,
        setDataDentro,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
