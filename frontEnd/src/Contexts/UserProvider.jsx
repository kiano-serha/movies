import React, { useContext } from "react";
import { createContext, useState } from "react";

const UserContext = createContext(null, () => {});

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  if (user == null) {
    setUser({
      first_name: sessionStorage.getItem("first_name"),
      last_name: sessionStorage.getItem("last_name"),
      email_address: sessionStorage.getItem("email_address"),
    });
  }
  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => {
  return useContext(UserContext);
};

export { UserContext, UserProvider, useUser };
