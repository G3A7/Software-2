function allowedTo(role) {
  return (req, res, next) => {
    if (!(req.currentUser.role == role)) {
      console.log("not admin");
      return res.status(401).json({
        status: "fail",
        message: "not Admin",
      });
    }

    next();
  };
}

module.exports = allowedTo;

/**
 * 
 *  async function getDetailsUser() {
    try {
      // console.log("dddd");
      // console.log(token);
      const { id } = jwtDecode(token);
      // console.log(id);
      const { data } = await axios.get(`https://ecommerce.routemisr.com/api/v1/users/${id}`);
      // console.log(data.data);
      setDetailsName(data.data);
    } catch (error) {
      console.log(error);
    }
  }
 */
