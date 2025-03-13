import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link } from "react-router-dom";
import Toast from "../components/Toast";
import { toast } from "sonner";
import { yupResolver } from "@hookform/resolvers/yup";
import RegisterSchema from "../Validators/RegisterSchema";

export default function Register() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email_address: "",
      password: "",
      confirm_password: "",
    },
    resolver: yupResolver(RegisterSchema),
  });

  axios.defaults.withCredentials = true;

  const onSubmit = (data) => {
    axios
      .post(import.meta.env.VITE_SERVER_URL + "/auth/register", data)
      .then((res) => {
        if (res.data.error) {
          toast.error(res.data.error);
        } else {
          toast.success(res.data.message);
          reset();
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
              <h2 className="text-center">Create new account</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="">
                  <label htmlFor="" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    data-testid="first_name"
                    {...register("first_name")}
                    // placeholder=""
                  />
                  <p className="text-danger fw-bold">
                    {errors.first_name?.message}
                  </p>
                </div>
                <div className="mt-3">
                  <label htmlFor="" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("last_name")}
                  />
                  <p className="text-danger fw-bold">
                    {errors.last_name?.message}
                  </p>
                </div>
                <div className="mt-3">
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
                  </label>
                  <input
                    type="password"
                    data-testid="password"
                    className="form-control"
                    {...register("password")}
                  />
                  <p className="text-danger fw-bold">
                    {errors.password?.message}
                  </p>
                </div>
                <div className="mt-3">
                  <label htmlFor="" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    data-testid="confirm_password"
                    className="form-control"
                    {...register("confirm_password")}
                  />
                  <p className="text-danger fw-bold">
                    {errors.confirm_password?.message}
                  </p>
                </div>
                <div className="form-footer">
                  <button className="btn btn-primary w-100">Sign Up</button>
                </div>
              </form>
            </div>
          </div>
          <div className="text-center text-secondary mt-3">
            Already have an account? <a href="/login">Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
}
