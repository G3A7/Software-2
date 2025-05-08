// import { jwtDecode } from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // console.log();
  // 1. لو مفيش userInfo → login
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }
  const { role } = jwtDecode(userInfo?.data?.token);
  // console.log(role);
  // jwtDecode(userInfo)
  // const role = userInfo?.data?.user?.role;

  // 2. لو Admin
  if (role === "admin") {
    if (location.pathname === "/admin") {
      return children;
    } else {
      return <Navigate to="/admin" replace />;
    }
  }

  // 3. لو User
  if (role === "user") {
    if (location.pathname === "/home") {
      return children;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  // 4. لو الدور غير معروف → login
  return <Navigate to="/login" replace />;
}

export default ProtectedRoute;
