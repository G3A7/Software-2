import { useContext, useEffect, useState } from "react";
import { userContext } from "../userContext/UserContext";
// import img from "../../public/myLove1.png";
import axios from "axios";
function Home() {
  const { token } = useContext(userContext);
  const [productsShow, setProductsShow] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5001/api/v1/products"
        );
        setProductsShow(data.data.products);
      } catch (error) {
        console.log(error.response?.data.message);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h1 className="text-center mt-5 text-2xl font-bold">
        Hi, {token?.data?.user?.name} 🖐
      </h1>
      <div className="mt-5 p-3">
        <div className="flex flex-wrap">
          {productsShow.map((product) => {
            return (
              <div
                key={product._id}
                className="w-full md:w-1/2 lg:w-1/3 p-2 relative"
              >
                <div className="bg-white shadow-md rounded-lg p-1">
                  <img
                    src={`http://localhost:5001/uploads/${product.fileImage}`}
                    className="w-full h-48 object-contain "
                    alt=""
                  />
                  <div className="flex justify-between items-center mt-2">
                    <h1 className="text-2xl font-bold text-slate-800">
                      {product.name}
                    </h1>
                    <p className="text-xl font-bold text-slate-600">
                      {product.price}$
                    </p>
                  </div>
                  <p className="line-clamp-1 text-lg mt-2 text-slate-600">
                    {product.description}
                  </p>
                  <div
                    onClick={() => {
                      console.log("add to favorite", product._id);
                    }}
                    className="cursor-pointer absolute top-4 left-4 w-[50px] h-[50px] text-center  flex items-center justify-center shadow rounded-3xl"
                  >
                    <button className="cursor-pointer">
                      <i className="fa-solid text-xl animate-bounce   fa-heart"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Home;
