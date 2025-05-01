import { createContext, useEffect, useState } from "react";
export const userContext = createContext();

function UserContext({ children }) {
  const [token, setToken] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("userInfo")) {
      setToken(() => JSON.parse(localStorage.getItem("userInfo")));
    } else {
      setToken(null);
    }
  }, []);

  return (
    <userContext.Provider value={{ setToken, token }}>
      {children}
    </userContext.Provider>
  );
}

export default UserContext;
