import InputBox from "../utils/InputBox";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { signin } from "../BackendAsService/features.js";
import {  getEmployeeData } from "../BackendAsService/Crud.js";
function Login() {
  const [loading, setLoading] = useState(false);
  const user = localStorage.getItem("user");
  const navigate = useNavigate();
  if (user) {
    return <Navigate to="/dashboard" />;
  }
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    setLoading(true);
    const res = await signin({
      email: formData.email,
      password: formData.password,
    }).finally(() => setLoading(false));

    
    console.log(res);
    if (res.user) {
      const user=await getEmployeeData({uid:res.user.uid});
      if(user.status==200){
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("userData", JSON.stringify(user.data));
        navigate("/dashboard");

      }
      else{
        toast.error("Failed to fetch the data Please sign in again")
      }
      // toast.success("Login Successfull")
    } else {
      toast.error("Please Enter A valid email and password");
    }
  };
  return (
    <div>
      <main className="h-screen  bg-no-repeat bg-cover  flex relative p-3 justify-center items-center font-serif w-full">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className="md:bg-white/30 bg-black/40  shadow-inner md:backdrop-blur-xl border border-white/30  shadow-gray-700  py-10 px-2 flex flex-col justify-center md:px-10 rounded-3xl">
          <h3 className="text-xl  text-center">
            Welcome Again to <span className="text-orange-800">HRMS</span>
          </h3>
          <img className="h-36 w-36 self-center" src="/avatar.png" alt="" />
          <InputBox
            inputroleimage="/mail-fill.svg"
            value={formData.email}
            onChange={handleChange}
            className="mt-5"
            required={true}
            InputStyle="w-80 p-3 outline-none"
            placeholder="Enter Email"
            type="email"
            name="email"
            
          />
          <InputBox
            inputroleimage="/key-fill.svg"
            value={formData.password}
            onChange={handleChange}
            className="mt-5 mb-2"
            required={true}
            InputStyle="w-80 p-3 outline-none"
            placeholder="Enter Password"
            type="password"
            name="password"
          />
          <div className="">Did't Have Account? Contact to admin</div>
          {loading ? (
            <div className="spinner place-self-center mt-5 md:mt-10"></div>
          ) : (
            <button
              onClick={handleSubmit}
              className="w-fit cursor-pointer mt-5 rounded-xl text-white hover:text-black self-center text-center  transition duration-300 ease-out hover:bg-white py-2 px-5  bg-black"
            >
              Login
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default Login;
