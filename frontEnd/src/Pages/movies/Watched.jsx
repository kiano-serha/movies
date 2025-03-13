import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { toast } from "sonner";
import Footer from "../components/Footer";

export default function Watched() {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_SERVER_URL + "/movies/watched")
      .then((res) => {
        if (res.data.data) {
          setMovies(res.data.data);
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  }, []);
  return (
    <div className="page">
      <Navbar PageName={"My Watched Movies"} />
      <div className="page-wrapper">
        <div className="page-wrapper">
          <div className="page-header d-print-none">
            <div className="container-xl">
              <div className="page-title">Movies Added to Watched List</div>
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
                                  <a
                                    className="dropdown-item"
                                    href={`/movie/view/${movie.id}`}
                                  >
                                    View
                                  </a>
                                </li>
                                <li>
                                  <a
                                    className="dropdown-item"
                                    href={`/ratings/add/${movie.id}`}
                                  >
                                    Add Rating
                                  </a>
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
      <Footer/>
    </div>
  );
}
