import React from "react";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../Contexts/UserProvider";
import Creatable from "react-select/creatable";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import Toast from "./Toast";
import Cookies from "js-cookie";

export default function Navbar({ PageName, setMovies }) {
  axios.defaults.withCredentials = true;
  const [user] = useContext(UserContext);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_SERVER_URL + "/movies/populate/filter/" + 2, {headers: {Authorization: 'Bearer ' + Cookies.get("token")},})
      .then((res) => {
        if (res.data.message) {
          if (res.data.message == "success") {
            setOptions(res.data.data);
          }
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  }, []);
  const onSubmit = (data) => {
    axios
      .post(import.meta.env.VITE_SERVER_URL + "/movies/search", data, {headers: {Authorization: 'Bearer ' + Cookies.get("token")},})
      .then((res) => {
        setMovies(res.data.data);
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const handleLogout = () => {
    Cookies.remove("token",{path : "/", domain: "movies-dba4.vercel.app"})
    axios
      .post(import.meta.env.VITE_SERVER_URL + "/auth/logout", {headers: {Authorization: 'Bearer ' + Cookies.get("token")},})
      .then((res) => {
        if (res.data.message) {
          window.location.href = "/login";
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  const { register, handleSubmit, setValue, getValues } = useForm({
    search_value: "",
    criteria: "",
  });

  const populateFilter = () => {
    axios
      .get(
        import.meta.env.VITE_SERVER_URL +
          "/movies/populate/filter/" +
          getValues("criteria"), {headers: {Authorization: 'Bearer ' + Cookies.get("token")},}
      )
      .then((res) => {
        if (res.data.message) {
          if (res.data.message == "success") {
            setOptions(res.data.data);
          }
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };
  return (
    <div className="mb-3">
      <Toast />
      <header className="navbar navbar-expand-md d-print-none">
        <div className="container-xl">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbar-menu"
            aria-controls="navbar-menu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <h1 className="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
            <a href=".">{PageName}</a>
          </h1>
          <div className="navbar-nav flex-row order-md-last">
            <div className="d-none d-md-flex"></div>
            <div className="nav-item dropdown">
              <a
                href="#"
                className="nav-link d-flex lh-1 text-reset p-0"
                data-bs-toggle="dropdown"
                aria-label="Open user menu"
              >
                <div className="d-none d-xl-block ps-2">
                  <div className="d-flex align-items-center">
                    <div data-testid="user_info">
                      {user && user.first_name + " " + user.last_name}
                      <div className="mt-1 small text-secondary">
                        {user && user.email_address}
                      </div>
                    </div>

                    <span className="avatar avatar-sm mx-1">KO</span>
                  </div>
                </div>
              </a>
              <div className="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      <header className="navbar-expand-md">
        <div className="collapse navbar-collapse" id="navbar-menu">
          <div className="navbar">
            <div className="container-xl">
              <ul className="navbar-nav">
                <li
                  className={`nav-item ${
                    PageName == "All Movies" ? "active" : ""
                  }`}
                >
                  <a className="nav-link" href="/">
                    <span className="nav-link-title">All Movies</span>
                  </a>
                </li>
                <li
                  className={`nav-item ${
                    PageName == "My Watched Movies" ? "active" : ""
                  }`}
                >
                  <a className="nav-link" href="/watched">
                    <span className="nav-link-title">Watched Movies</span>
                  </a>
                </li>
                <li
                  className={`nav-item ${
                    PageName == "View Movie" ? "active" : ""
                  }`}
                >
                  <a className="nav-link" href="/ratings">
                    <span className="nav-link-title">My Reviews</span>
                  </a>
                </li>
              </ul>
              {PageName == "All Movies" ? (
                <div className="my-2 my-md-0 flex-grow-1 flex-md-grow-0 order-first order-md-last">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                      <div className="col">
                        <div className="input-icon">
                          <Creatable
                            isClearable={true}
                            isSearchable={true}
                            placeholder="Search By Criteria"
                            options={options}
                            required
                            onChange={(selectedOption, triggeredAction) => {
                              if (triggeredAction.action == "clear") {
                                setValue("search_value", "");
                              } else if (
                                triggeredAction.action == "create-option"
                              ) {
                                setValue("search_value", selectedOption.value);
                              } else if (
                                triggeredAction.action == "select-option"
                              ) {
                                setValue("search_value", selectedOption.value);
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <select
                          className="form-select"
                          {...register("criteria", {
                            onChange: () => {
                              populateFilter();
                            },
                          })}
                        >
                          <option value="2">Title</option>
                          <option value="3">Actor</option>
                          <option value="4">Publisher</option>
                          <option value="5">Genre</option>
                        </select>
                      </div>
                      <div className="col-md-1">
                        <button className="btn btn-primary" type="submit">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                            <path d="M21 21l-6 -6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
