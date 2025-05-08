import { useContext, useEffect, useState } from "react";
import { userContext } from "../userContext/UserContext";
// import img from "../../public/myLove1.png";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { wishListContext } from "../userContext/wishListContext";
import toast from "react-hot-toast";

function Home() {
  //  setLoaderIconCart((prev) => ({ ...prev, [id]: true }));
  //  setLoaderIconCart((prev) => ({ ...prev, [id]: false }));
  const { addToOrRemoveFromWishList, getWishList, wishList } =
    useContext(wishListContext);
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

  useEffect(() => {
    token && handleGetWishList();
  }, [token]);

  useEffect(() => {
    console.log(
      localStorage.getItem("wishListLocal")
        ? JSON.parse(localStorage.getItem("wishListLocal"))
        : []
    );
    // console.log(JSON.parse(localStorage.getItem("wishListLocal")));
  }, []);
  const [name, setName] = useState("");
  useEffect(() => {
    if (token) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const { name } = jwtDecode(userInfo?.data?.token);
      // console.log(name);
      setName(name);
    }
  }, [token]);

  // const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // if (!userInfo) {
  //   return <Navigate to="/login" replace />;
  // }
  // const { name } = jwtDecode(userInfo?.data?.token);

  async function handleAddToWishList(productId) {
    const dataPromise = addToOrRemoveFromWishList(productId);
    toast.promise(dataPromise, {
      loading: "loading...",
      success: (data) => `${data.message}`,
      error: "error",
    });
    try {
      const data = await dataPromise;
      console.log(data);
      // getWishList();
      handleGetWishList();
    } catch (err) {
      console.log(err.response.data.message);
    }
  }

  async function handleGetWishList() {
    await getWishList();
  }

  return (
    <div>
      <div className="flex items-center justify-center py-5 shadow">
        <h1 className="text-center  text-2xl font-bold">Hi, {name} 🖐</h1>
        <div className="text-green-600 w-[40px] h-[40px] flex items-center justify-center relative cursor-pointer ml-5">
          <span className="absolute top-[-15px] right-0 w-[25px] h-[25px] rounded-full border text-center ">
            {wishList ? wishList?.length : 0}
          </span>
          <i className="fa-solid text-2xl font-bold   fa-heart"></i>
          {/* <i className="fa-solid fa-cart-plus text-2xl font-bold"></i> */}
        </div>
      </div>
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
                      handleAddToWishList(product._id);
                      // console.log("add to favorite", product._id);
                    }}
                    className="cursor-pointer absolute top-4 left-4 w-[50px] h-[50px] text-center  flex items-center justify-center  shadow rounded-3xl"
                  >
                    <button className="cursor-pointer">
                      <i
                        className={`fa-solid text-xl animate-bounce
                          
                          ${
                            wishList.find((item) => {
                              return item.product._id == product._id;
                            })
                              ? "text-red-500"
                              : "text-gray-300"
                          }
                            fa-heart`}
                      ></i>
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
