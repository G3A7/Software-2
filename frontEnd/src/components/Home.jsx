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
  const { addToOrRemoveFromWishList, getWishList, wishList, totalPrice } =
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // useEffect(() => {
  //   // console.log(
  //   //   localStorage.getItem("wishListLocal")
  //   //     ? JSON.parse(localStorage.getItem("wishListLocal"))
  //   //     : []
  //   // );
  //   token && handleGetWishList();
  //   // console.log(JSON.parse(localStorage.getItem("wishListLocal")));
  // }, [token]);
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
  // console.log("adasdasdasdasdadasdasdasdasdadasdasd".length);
  async function handleGetWishList() {
    await getWishList();
  }

  return (
    <div>
      <div className="flex items-center justify-between py-5 px-5 shadow">
        <h1 className="text-center  text-2xl font-bold">
          Hi, {name} <span className="animate-bay">🖐</span>
        </h1>
        <div className="flex items-center justify-between ">
          <div>
            <p>
              Total:<span>{totalPrice}</span>
            </p>
          </div>
          <div
            className={`${
              wishList?.length > 0 ? "text-red-600" : "text-gray-600"
            } w-[40px] h-[40px] flex items-center justify-center relative cursor-pointer ml-5`}
          >
            <span className="absolute top-[-15px] right-0 w-[25px] h-[25px] rounded-full border text-center ">
              {wishList ? wishList?.length : 0}
            </span>
            <i className="fa-solid text-2xl font-bold   fa-heart"></i>
          </div>
        </div>
      </div>
      <div className="mt-5 p-3">
        <div className="flex flex-wrap">
          {productsShow.map((product) => {
            return (
              <div
                key={product._id}
                className="w-full sm:w-1/2 md:w-1/4  p-2 relative hover:-translate-y-[7px] group/h  transition-all duration-300"
              >
                <div className=" shadow-md rounded-lg p-2  ">
                  <img
                    src={`http://localhost:5001/uploads/${product.fileImage}`}
                    className="w-[80%] mx-auto h-48 group-hover/h:scale-[.9]  rounded-2xl transition-all duration-300"
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
                  <div
                    className={`shadow p-1 rounded-md group relative ${
                      product.description.length >= 36 &&
                      "hover:after:absolute hover:after:w-[0px] hover:after:h-[0px]  hover:after:top-[-20px] hover:after:left-[50%] hover:after:border-[10px] hover:after:border-l-transparent hover:after:border-r-transparent hover:after:border-b-sky-700 hover:after:border-t-transparent"
                    } hover:cursor-pointer`}
                  >
                    <p className="line-clamp-1 text-lg mt-2 text-slate-600 ">
                      {product.description}
                    </p>
                    {product.description.length >= 36 && (
                      <div
                        className="opacity-0 invisible rounded-2xl p-2 cursor-default  left-[50%] translate-x-[-50%] absolute bg-slate-300 top-[-130px] shadow md:w-[280px] w-[260px]  
                     min-h-[70px]  transition-all duration-200 group-hover:opacity-100 break-words  group-hover:visible"
                      >
                        {product.description}
                      </div>
                    )}
                  </div>
                  <div
                    onClick={() => {
                      handleAddToWishList(product._id);
                      // console.log("add to favorite", product._id);
                    }}
                    className="cursor-pointer absolute top-4 left-1 w-[50px] h-[50px] text-center  flex items-center justify-center"
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
