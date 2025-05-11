/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState } from "react";
import { userContext } from "./UserContext";
import axios from "axios";
export const wishListContext = createContext();

function WishListContext({ children }) {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const tokenLo = userInfo?.data?.token;
  //   const { token } = useContext(userContext);
  //   const [tokenL, setTokenL] = useState(null);
  const [wishList, setWishList] = useState(
    localStorage.getItem("wishListLocal")
      ? JSON.parse(localStorage.getItem("wishListLocal"))
      : []
    // JSON.parse(localStorage.getItem("wishListLocal"))
    // []
  );
  const [totalPrice, setTotalPrice] = useState(0);
  //   console.log(localStorage.getItem("wishListLocal"));
  //   useEffect(() => {
  //     if (token) {
  //       setTokenL(tokenLo);
  //     }
  //   }, [token]);
  const addToOrRemoveFromWishList = async (productId) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const { data } = await axios.post(
        `http://localhost:5001/api/v1/wishlist/${productId}`,
        {},
        {
          headers: {
            Authorization: tokenLo,
          },
        }
      );
      //   console.log(data);
      return data;
    } catch (err) {
      throw err;
      //   console.log(err.responce.data.message);
    }
  };

  const getWishList = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5001/api/v1/wishlist",
        {
          headers: {
            Authorization: tokenLo,
          },
        }
      );
      console.log("first One");
      console.log(data?.data?.wishlist);
      console.log(data?.data);
      setTotalPrice(data?.data?.sum);
      setWishList(data?.data?.wishlist);
      localStorage.setItem(
        "wishListLocal",
        JSON.stringify(data?.data?.wishlist)
      );
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  return (
    <wishListContext.Provider
      value={{
        addToOrRemoveFromWishList,
        getWishList,
        wishList,
        setWishList,
        totalPrice,
      }}
    >
      {children}
    </wishListContext.Provider>
  );
}

export default WishListContext;
