import { useState, useEffect, createContext } from "react";

// After I made all the code and saw there was a lot of duplicate code, I finally realised why context is so usefull.
export const CategoriesContext = createContext;

export const CategoriesProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      const response = await fetch("http://localhost:3000/categories");
      const data = await response.json();
      setCategories(data);
    }

    fetchCategories();
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories }}>
      {children}
    </CategoriesContext.Provider>
  );
};
