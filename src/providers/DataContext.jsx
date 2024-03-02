import { createContext, useContext, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const setGlobalData = (newData) => {
        setData(newData);
  };
  return (
    <DataContext.Provider value={{ data, setGlobalData }}>
      {children}
    </DataContext.Provider>
  );
};


export const useData = () => useContext(DataContext);