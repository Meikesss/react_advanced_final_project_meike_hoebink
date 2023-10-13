import { useState, useEffect, createContext } from "react";

// After I made all the code and saw there was a lot of duplicate code, I finally realised why context is so usefull.
export const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch("http://localhost:3000/users/");
      const data = await response.json();
      setUsers(data);
    }

    fetchUsers();
  }, []);
  return (
    <UsersContext.Provider value={{ users }}>{children}</UsersContext.Provider>
  );
};
