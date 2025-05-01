import { useContext } from "react";
import { userContext } from "../userContext/UserContext";

function Home() {
  const { token } = useContext(userContext);
  return (
    <div>
      <h1 className="text-center mt-5 text-2xl font-bold">
        Hi, {token?.data?.user?.name} 🖐
      </h1>
      <div>
        
      </div>
    </div>
  );
}

export default Home;
