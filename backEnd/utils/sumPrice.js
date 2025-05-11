const sumPrice = (arrPrice) => {
  let sum = 0;
  // console.log("from sumPrice = ", arrPrice);
  arrPrice.forEach((e) => {
    sum += e?.product?.price;
  });
  // console.log("sum = ", sum);
  return sum;
};

module.exports = sumPrice;

// [
//   {
//     product: {
//       price: 20,
//     },
//   },
// ];
