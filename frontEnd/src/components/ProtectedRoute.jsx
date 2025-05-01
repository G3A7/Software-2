// import { Navigate } from "react-router-dom";

// function ProtectedRoute({ children }) {
//   if (!localStorage.getItem("userInfo")) {
//     return <Navigate to={"/login"} />;
//   } else {
//     const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//     if (userInfo?.data?.user?.role == "admin") {
//       if (location.pathname === "/admin") {
//         return children;
//       } else {
//         return <Navigate to="/admin" replace />;
//       }
//     } else {
//       const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//       if (userInfo?.data?.user?.role == "user") {
//         if (location.pathname === "/home") {
//           return children;
//         } else {
//           return <Navigate to="/home" replace />;
//         }
//       // console.log("user");
//       // return <Navigate to="/home" replace />;
//     }
//   }
// }
// }
// export default ProtectedRoute;

import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // 1. لو مفيش userInfo → login
  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  const role = userInfo?.data?.user?.role;

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
