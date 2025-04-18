import { createContext, useEffect, useState } from "react";
export const userContext = createContext();

function UserContext({ children }) {
  const [token, setToken] = useState(null);
  useEffect(() => {
    // console.log(localStorage.getItem("userInfo"))
    if (!localStorage.getItem("userInfo")) {
      setToken(null);
    } else {
      console.log("dasdasd");
      setToken(JSON.parse(localStorage.getItem("userInfo")));
    }
  }, []);
  return (
    <userContext.Provider value={{ setToken, token }}>
      {children}
    </userContext.Provider>
  );
}

export default UserContext;
