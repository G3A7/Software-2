import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginAndRegister from "./components/LoginAndRegister";
import Home from "./components/Home";
import { Toaster } from "react-hot-toast";
import UserContext from "./userContext/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./components/Admin";
import WishListContext from "./userContext/wishListContext";

function App() {
  const router = createBrowserRouter([
    {
      index: true,
      element: <LoginAndRegister />,
    },
    {
      path: "/login",
      element: <LoginAndRegister />,
    },
    {
      path: "/register",
      element: <LoginAndRegister />,
    },
    {
      path: "/home",

      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute>
          <Admin />
        </ProtectedRoute>
      ),
    },
  ]);
  return (
    <UserContext>
      <WishListContext>
        <div>
          <RouterProvider router={router} />
          <Toaster />
          {/* <LoginAndRegister /> */}
        </div>
      </WishListContext>
    </UserContext>
  );
}

export default App;
