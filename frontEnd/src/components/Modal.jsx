import { useRef } from "react";

function Modal({ setShowModal, updateProduct, productId }) {
  const inpref = useRef(null);
  return (
    <div className="fixed top-0 left-0 w-full h-full  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 md:w-1/3">
        <h2 className="text-xl font-bold mb-4">Update</h2>
        <p className="mb-4">Update Nike Price</p>
        <input
          ref={inpref}
          type="number"
          className="block mb-5 outline-none border-none shadow p-2 rounded-2xl"
          placeholder="enter new price"
        />
        <button
          onClick={() => {
            setShowModal(false);
          }}
          className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button>
        <button
          onClick={() => {
            const value = inpref.current.value;
            if (!value) return alert("Please enter a value");
            if (isNaN(value)) return alert("Please enter a number");
            if (value <= 0) return alert("Please enter a positive number");

            // setNewPrice(value);
            updateProduct(productId, value);
            setShowModal(false);
          }}
          className="bg-orange-600 cursor-pointer text-white px-4 py-2 rounded hover:bg-orange-700 ms-1"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}

export default Modal;
