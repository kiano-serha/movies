import { useEffect, useState } from "react";
import Toast from "./components/Toast";
import Navbar from "./components/Navbar";
import { toast } from "sonner";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Footer from "./components/Footer";
import Cookies from "js-cookie";

export default function Index() {
  const location = useLocation();
  axios.defaults.withCredentials = true;
  useEffect(() => {
    if (location.state) {
      toast.success(location.state.message);
      window.history.replaceState({}, "");
    }
    axios
      .get(import.meta.env.VITE_SERVER_URL + "/movies/all", {headers: {Authorization: 'Bearer ' + Cookies.get("token")},})
      .then((res) => {
        setMovies(res.data.data);
      })
      .catch((err) => {
        toast.error(err);
      });
  }, [location.state]);

  const [movies, setMovies] = useState([]);

  const addWatched = (id) => {
    axios
      .get(import.meta.env.VITE_SERVER_URL + "/movies/add/watched/" + id, {headers: {Authorization: 'Bearer ' + Cookies.get("token")},})
      .then((res) => {
        if (res.data.message) {
          toast.success(res.data.message);
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };
  return (
    <div className="page">
      <Navbar PageName={"All Movies"} setMovies={setMovies} />
      <div className="page-wrapper">
        <div className="page-wrapper">
          <div className="page-header d-print-none">
            <div className="container-xl">
              <div className="page-title">Movies</div>
            </div>
          </div>
          <div className="page-body">
            <div className="container-xl">
              <div className="row row-cards">
                {movies.map((movie) => (
                  <div className="col-md-4 col-xs-1" key={movie.id}>
                    <div className="card">
                      <div className="card-body">
                        <img
                          src={`${
                            import.meta.env.VITE_SERVER_URL +
                            movie.movie_cover_path
                          }`}
                          alt="No Image"
                          className="w-100 p-0 m-0"
                          style={{ height: "40vh" }}
                        />
                      </div>
                      <div className="card-footer">
                        <h2>{movie.title}</h2>
                        <h4>{movie.year}</h4>
                        <strong>Genres: </strong>
                        <span>{movie.genres}</span>
                        <div className="row">
                          <div className="col"></div>
                          <div className="col-auto">
                            <div className="dropdown">
                              <button
                                className="btn btn-primary"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                Options
                              </button>
                              <ul className="dropdown-menu">
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`/movie/view/${movie.id}`}
                                  >
                                    View
                                  </Link>
                                </li>
                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`/ratings/add/${movie.id}`}
                                  >
                                    Add Rating
                                  </Link>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item"
                                    onClick={() => {
                                      addWatched(movie.id);
                                    }}
                                  >
                                    Add to Watched
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
