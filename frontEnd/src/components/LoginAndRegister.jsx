import axios from "axios";
import { useFormik } from "formik";
import { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { userContext } from "../userContext/UserContext";

function LoginAndRegister() {
  const { setToken } = useContext(userContext);
  const navigate = useNavigate();
  const [style, setStyle] = useState(false);
  const [loginOrRegister, setLoginOrRegister] = useState(true);
  const firstRender = useRef(true);
  //   const inp1 = useRef();
  //   const inp2 = useRef();
  //   const inp3 = useRef();
  useEffect(() => {
    if (firstRender.current == true) {
      firstRender.current = false;
      return;
    }
    setLoginOrRegister((prev) => !prev);
    // inp1.current.value = "";
    // inp2.current.value = "";
    // inp3.current.value = "";
  }, [style]);
  useEffect(() => {
    // console.log(loginOrRegister);
  }, [loginOrRegister]);

  const initialValues = {
    name: "",
    email: "",
    password: "",
  };
  const validationSchema = Yup.object().shape({
    // name: Yup.string()
    //   .required()
    //   .matches(/^[a-zA-Z]{3,12}$/i, "must be range 3 to 12 Char 😄"),
    ...(style && {
      name: Yup.string()
        .required()
        .matches(/^[a-zA-Z]{3,12}$/i, "must be range 3 to 12 Char 😄"),
    }),

    email: Yup.string()
      .required()
      .matches(/^[a-zA-Z0-9]+@gmail\.com$/i, "must be Email is Valid😄"),
    password: Yup.string()
      .required()
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&) 😄"
      ),
  });
  async function onSubmit(vals, helps) {
    if (!style) {
      // eslint-disable-next-line no-unused-vars
      const { name, ...loginData } = vals;
      vals = loginData;
    }
    // console.log(vals);
    const endPoint = `http://localhost:5001/api/v1/auth/${
      !style ? "login" : "register"
    }`;
    const dataPromise = axios.post(endPoint, vals);
    toast.promise(dataPromise, {
      loading: "loading",
      error: (data) => data.response.data.message,
      success: style ? "Account Created Succsesfuly" : "Loggin Succsesfuly",
    });
    try {
      const { data } = await dataPromise;
      // console.log(data);
      // to context
      localStorage.setItem("userInfo", JSON.stringify(data));
      setToken(JSON.parse(localStorage.getItem("userInfo")));
      setTimeout(() => {
        navigate("/home");
      }, 800);
      helps.resetForm();
    } catch (error) {
      toast.error(error.response?.data.message);
      //   console.log(error.response?.data.message);
    }
  }
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className="body">
      <div className="container">
        <div className={`${!style ? "form" : "form transformation-form "}`}>
          <h1 className="title"> {!style ? "Sign in" : " Sign up"}</h1>
          <div className="icons">
            <span>
              <i className="fa-brands fa-facebook" />
            </span>
            <span>
              <i className="fa-brands fa-square-google-plus" />
            </span>
            <span>
              <i className="fa-brands fa-square-github" />
            </span>
            <span>
              <i className="fa-brands fa-linkedin" />
            </span>
          </div>
          <p>or use your Email and password</p>
          <form onSubmit={formik.handleSubmit}>
            <div className={`in-name ${!style ? "hidden" : ""} `}>
              <input
                id="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                onInput={formik.handleBlur}
                type="text"
                placeholder="Name"
              />
            </div>
            {style && formik.errors.name && formik.touched.name && (
              <span className="error">{formik.errors.name}</span>
            )}
            <div>
              <input
                id="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                onInput={formik.handleBlur}
                type="text"
                placeholder="Email"
              />
            </div>
            {formik.errors.email && formik.touched.email && (
              <span className="error">{formik.errors.email}</span>
            )}
            <div>
              <input
                id="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                onInput={formik.handleBlur}
                type="password"
                placeholder="Password"
              />
            </div>
            {formik.errors.password && formik.touched.password && (
              <span className="error">{formik.errors.password}</span>
            )}
            <p>Forget Your Password?</p>
            <button
              disabled={!formik.isValid || !formik.dirty}
              type="submit"
              className="title"
            >
              {!style ? "Sign in" : " Sign up"}
            </button>
          </form>
        </div>
        <div className={`left ${!style ? "left" : "left transformation"}`}>
          <h1>Hello,</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa,
            consectetur.
          </p>
          <button
            onClick={() => {
              setStyle((prev) => !prev);
            }}
            className="next"
          >
            {!style ? "Sign up" : " Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginAndRegister;
