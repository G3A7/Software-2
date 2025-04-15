import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginAndRegister from "./components/LoginAndRegister";
import Home from "./components/Home";
import { Toaster } from "react-hot-toast";

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
      element: <Home />,
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
      <Toaster />
      {/* <LoginAndRegister /> */}
    </div>
  );
}

export default App;
