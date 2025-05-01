import { useFormik } from "formik";
import img from "../../public/myLove1.png";
import * as Yup from "yup";
import axios from "axios";
// import { useEffect, useState } from "react";

function Form({ setUpdate }) {
  async function onSubmit(values, { resetForm }) {
    // console.log(values);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("price", values.price);
    formData.append("description", values.description);
    formData.append("fileImage", values.fileImage);
    // console.log(formData);
    // for (let [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }

    try {
      const { data } = await axios.post(
        "http://localhost:5001/api/v1/products",
        formData
      );
      setUpdate((prev) => !prev);
      console.log("Product uploaded successfully", data);
      resetForm();
    } catch (error) {
      console.log(error.response?.data.message);
    }
  }
  const validationSchema = Yup.object().shape({
    name: Yup.string().min(3).max(10).required(),
    price: Yup.number()
      .min(80, "Price must be at least 80")
      .required("Price is required"),

    description: Yup.string()
      .min(10, "Description must be at least 10 characters")
      .required("Description is required"),
    fileImage: Yup.mixed()
      .required("An image is required")
      .test("fileSize", "File too large", (value) => {
        return value && value.size <= 2 * 1024 * 1024; // 2MB
      })
      .test("fileType", "Unsupported file format", (value) => {
        return (
          value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
        );
      }),
  });
  const initialValues = {
    name: "",
    price: "",
    description: "",
    fileImage: "",
  };

  let formik_2 = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });
  return (
    <form
      onSubmit={formik_2.handleSubmit}
      className="w-full md:w-[60%] space-y-[30px]  p-2   mx-auto mt-10 "
    >
      <h1 className="text-center text-xl font-medium">Create Product</h1>
      <div className="border rounded-md w-[90%] mx-auto h-[40px] focus-within:border-blue-900 focus-within:border-[2px]">
        <input
          id="name"
          onInput={formik_2.handleChange}
          onBlur={formik_2.handleBlur}
          value={formik_2.values.name}
          type="text"
          className="w-[100%] h-[100%] p-2 border-none outline-none shadow-none"
          placeholder="Product Name.."
        />
        {formik_2.errors.name && formik_2.touched.name && (
          <span className="text-red-500    block me-auto w-[90%]">
            *{formik_2.errors.name}
          </span>
        )}
      </div>

      <div className="border rounded-md    w-[90%] mx-auto h-[80px] focus-within:border-blue-900 focus-within:border-[2px]">
        <textarea
          id="description"
          name="description"
          value={formik_2.values.description}
          onInput={formik_2.handleChange}
          onBlur={formik_2.handleBlur}
          cols={5}
          rows={5}
          placeholder="Description.."
          className="w-[100%] p-2  h-[100%] border-none outline-none shadow-none resize-none"
        ></textarea>
        {formik_2.errors.description && formik_2.touched.description && (
          <span className="text-red-500    block me-auto w-[90%]">
            *{formik_2.errors.description}
          </span>
        )}
      </div>

      <div className="border rounded-md  w-[90%] mx-auto h-[40px] focus-within:border-blue-900 focus-within:border-[2px]">
        <input
          id="price"
          name="price"
          value={formik_2.values.price}
          onChange={formik_2.handleChange}
          onBlur={formik_2.handleBlur}
          type="number"
          className="w-[100%] h-[100%] p-2 border-none outline-none shadow-none"
          placeholder="Product price .."
        />
        {formik_2.errors.price && formik_2.touched.price && (
          <span className="text-red-500    block me-auto w-[90%]">
            *{formik_2.errors.price}
          </span>
        )}
      </div>

      <div className="flex  rounded-md w-[90%] mx-auto h-[40px] focus-within:border-blue-900 focus-within:border-[2px]">
        <input
          id="fileImage"
          name="fileImage"
          type="file"
          accept="image/*"
          onChange={(event) => {
            formik_2.setFieldValue("fileImage", event.currentTarget.files[0]);
          }}
          onBlur={formik_2.handleBlur}
          className="hidden"
        />

        <label
          htmlFor="fileImage"
          className="text-2xl cursor-pointer mr-[35px]"
        >
          <i className="fa-solid fa-image text-red-900 "></i>
          <span className="ml-1">Iamge</span>
        </label>

        <div className="w-[35px] h-[35px] rounded-full overflow-hidden border">
          {/* <img src={img} className="w-full h-full object-cover" alt="" /> */}
          {formik_2.values.fileImage ? (
            <img
              src={URL.createObjectURL(formik_2.values.fileImage)}
              alt="Preview"
              className="w-32 h-32 object-cover mt-2"
            />
          ) : (
            <img
              src={img}
              alt="Preview"
              className="w-32 h-32 object-cover mt-2"
            />
          )}
        </div>
        {formik_2.errors.fileImage && formik_2.touched.fileImage && (
          <span className="text-red-500    ">*{formik_2.errors.fileImage}</span>
        )}
      </div>

      <div className="w-[90%] mx-auto">
        <button
          disabled={!(formik_2.dirty && formik_2.isValid)}
          type="submit"
          className="w-full sm:w-[150px] bg-rose-700 py-[6px] px-[12px] rounded-md cursor-pointer text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create
        </button>
      </div>
    </form>
  );
}

export default Form;

/*
const express = require('express');
const multer = require('multer');
const app = express();

// تكوين multer لحفظ الملفات في مجلد 'uploads'
const upload = multer({ dest: 'uploads/' });

app.post('/api/products', upload.single('fileImage'), (req, res) => {
  // الحقول النصية تكون في req.body
  const { name, price, description } = req.body;
  
  // معلومات الملف تكون في req.file
  const fileImage = req.file;
  
  console.log(name, price, description);
  console.log(fileImage);
  
  // ... معالجة البيانات هنا
  
  res.send('تم استلام البيانات بنجاح!');
});

app.listen(3000, () => console.log('الخادم يعمل على port 3000'));

*/
