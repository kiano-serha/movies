import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import Toast from "../components/Toast";
import { UserContext } from "../../Contexts/UserProvider";
import { yupResolver } from "@hookform/resolvers/yup";
import LoginSchema from "../Validators/LoginSchema";
import Cookies from "js-cookie";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email_address: "",
      password: "",
    },
    resolver: yupResolver(LoginSchema),
  });

  axios.defaults.withCredentials = true;

  const onSubmit = (data) => {
    axios
      .post(import.meta.env.VITE_SERVER_URL + "/auth/login", data, {headers: {Authorization: 'Bearer ' + Cookies.get("token")},})
      .then((res) => {
        if (res.data.error != undefined) {
          toast.error(res.data.error);
        } else {
          sessionStorage.setItem("first_name", res.data.user_first_name);
          sessionStorage.setItem("last_name", res.data.user_last_name);
          sessionStorage.setItem("email_address", res.data.user_email_address);
          Cookies.set("token", res.data.token);
          window.location.href = "/";
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };
  return (
    <div className="d-flex flex-column">
      <Toast />
      <div className="page page-center" style={{ height: "100vh" }}>
        <div className="container container-narrow py-4">
          <div className="card card-md">
            <div className="card-body">
              <h2 className="text-center">Login to your account</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="">
                  <label htmlFor="" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    data-testid="email_address"
                    {...register("email_address")}
                  />
                  <p className="text-danger fw-bold">
                    {errors.email_address?.message}
                  </p>
                </div>
                <div className="mt-3">
                  <label htmlFor="" className="form-label">
                    Password
                    <span className="form-label-description">
                      <a href="./forgot-password.html">I forgot password</a>
                    </span>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    data-testid="password"
                    {...register("password")}
                  />
                  <p className="text-danger fw-bold">
                    {errors.password?.message}
                  </p>
                </div>
                <div className="form-footer">
                  <button className="btn btn-primary w-100">Sign In</button>
                </div>
              </form>
            </div>
          </div>
          <div className="text-center text-secondary mt-3">
            Don't have account yet? <a href="/register">Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  );
}
