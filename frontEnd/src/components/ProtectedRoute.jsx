import { useContext } from "react";
import { userContext } from "../userContext/UserContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { token, setToken } = useContext(userContext);

  if (!localStorage.getItem("userInfo") || !token) {
    setToken(null);
    return <Navigate to={"/login"} />;
  } else {
    setToken(JSON.parse(localStorage.getItem("userInfo")));
    return children;
  }
}

export default ProtectedRoute;
