import Form from "./Form";
import { useContext, useEffect, useState } from "react";
import { userContext } from "../userContext/UserContext";
import axios from "axios";
import Modal from "./Modal";
// import img from "../../public/myLove1.png";

function Admin() {
  const { token } = useContext(userContext);
  const [products, setProducts] = useState([]);
  const [update, setUpdate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // const [newPrice, setNewPrice] = useState(0);
  const [productId, setProductId] = useState(null);
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

  const deleteProduct = async (id) => {
    try {
      console.log(id);
      const { data } = await axios.delete(
        `http://localhost:5001/api/v1/products/${id}`
      );
      console.log(data);
      setUpdate(!update);
    } catch (error) {
      console.log(error.response?.data.message);
    }
  };
  const updateProduct = async (id, newPrice) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5001/api/v1/products/${id}`,
        { price: newPrice }
      );
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
      <h1 className="text-center mt-5 text-2xl font-bold">
        Hi, {token?.data?.user?.name} 🖐
      </h1>
      <Form setUpdate={setUpdate} />
      <div className="my-5">
        <div className="flex flex-wrap">
          {products.length ? (
            products?.map((product) => {
              return (
                <div key={product._id} className="w-full md:w-1/4   p-2">
                  <div className="bg-white shadow-md rounded-lg p-2">
                    <img
                      className="w-full h-48 object-cover"
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
            <p className="text-center w-full text-3xl font-medium ">Not Products</p>
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
