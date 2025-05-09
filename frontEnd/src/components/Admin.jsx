import Form from "./Form";
import { useContext, useEffect, useState } from "react";
import { userContext } from "../userContext/UserContext";
import axios from "axios";
import Modal from "./Modal";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
// import img from "../../public/myLove1.png";

function Admin() {
  // const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // let tokenLo = userInfo?.data?.token;
  const { token } = useContext(userContext);
  const [products, setProducts] = useState([]);
  const [update, setUpdate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // const [newPrice, setNewPrice] = useState(0);
  const [productId, setProductId] = useState(null);
  const [tokenLo, setTokenLo] = useState("");
  useEffect(() => {
    async function getProducts() {
      try {
        const { data } = await axios.get(
          "http://localhost:5001/api/v1/products"
        );
        setProducts(data.data.products);
      } catch (error) {
        console.log(error.response?.data.message);
      }
    }
    getProducts();
  }, [update]);
  const [name, setName] = useState("");
  useEffect(() => {
    if (token) {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      setTokenLo(userInfo?.data?.token);
      const { name } = jwtDecode(userInfo?.data?.token);
      // console.log(name);
      setName(name);
    }
  }, [token]);
  const deleteProduct = async (id) => {
    const dataPromise = axios.delete(
      `http://localhost:5001/api/v1/products/${id}`,
      {
        headers: {
          authorization: tokenLo,
        },
      }
    );
    toast.promise(dataPromise, {
      loading: "loading",
      error: (data) => data.response.data.message,
      success: "Deleted 😌",
    });
    try {
      // console.log(tokenLo);
      // console.log(id);
      const { data } = await dataPromise;
      console.log(data);
      setUpdate(!update);
    } catch (error) {
      console.log(error.response?.data.message);
    }
  };
  const updateProduct = async (id, newPrice) => {
    const dataPromise = axios.put(
      `http://localhost:5001/api/v1/products/${id}`,
      { price: newPrice },
      {
        headers: {
          authorization: tokenLo,
        },
      }
    );
    toast.promise(dataPromise, {
      loading: "loading",
      error: (data) => data.response.data.message,
      success: "Updated Price 😋",
    });

    try {
      const { data } = await dataPromise;
      console.log(data);
      setUpdate(!update);
    } catch (error) {
      console.log(error.response?.data.message);
    }
  };
  const handleUpdate = () => {
    setShowModal(true);
  };

  return (
    <div className="w-[90%] mx-auto">
      <h1 className="text-center mt-5 text-2xl font-bold">Hi, {name} 🖐</h1>
      <Form setUpdate={setUpdate} />
      <div className="my-5">
        <div className="flex flex-wrap">
          {products.length ? (
            products?.map((product) => {
              return (
                <div key={product._id} className="w-full md:w-1/4   p-2">
                  <div className="bg-white shadow-md rounded-lg p-2 hover:-translate-y-[2px]  transition-all duration-300">
                    <img
                      className="w-[90%] mx-auto  h-48"
                      src={`http://localhost:5001/uploads/${product.fileImage}`}
                      alt={product.fileImage}
                    />
                    <div className="flex items-center justify-between">
                      <h2 className="text-center text-xl font-bold">
                        {product.name}
                      </h2>
                      <p className="text-center text-gray-600">
                        {product.price} $
                      </p>
                    </div>
                    <p className=" line-clamp-1 text-gray-600">
                      {product.description}
                    </p>
                    <div className="flex justify-between mt-2">
                      <button
                        onClick={() => {
                          deleteProduct(product._id);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                      <button
                        onClick={() => {
                          handleUpdate();
                          setProductId(product._id);
                        }}
                        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center w-full text-3xl font-medium ">
              Not Products
            </p>
          )}
        </div>
      </div>
      {showModal && (
        <Modal
          setShowModal={setShowModal}
          updateProduct={updateProduct}
          productId={productId}
        />
      )}
    </div>
  );
}

export default Admin;
