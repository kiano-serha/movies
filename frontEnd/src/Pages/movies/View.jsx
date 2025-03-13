import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import Cookies from "js-cookie";

export default function View() {
  const { id } = useParams();
  const [movie, setMovie] = useState({
    title: "",
    year: "",
    genres: "",
    actors: "",
    description: "",
  });

  axios.defaults.withCredentials = true;

  const [ratings, setRatings] = useState([
    {
      rater_name: "",
      type: "",
      num_of_stars: "",
      description: "",
    },
  ]);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_SERVER_URL + "/movies/info/" + id, {headers: {Authorization: 'Bearer ' + Cookies.get("token")},})
      .then((res) => {
        setMovie(res.data.movie);
        setRatings(res.data.ratings);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <>
      <div className="page">
        <Navbar PageName={"View Movie"} />
        <div className="page-wrapper">
          <div className="page-header">
            <div className="container-xl">
              <div className="page-title">{movie.title}</div>
            </div>
          </div>
          <div className="page-body">
            <div className="container-xl">
              <div className="row row-cards">
                <div className="col">
                  <div className="card">
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-4">
                          <img
                            src={`${
                              import.meta.env.VITE_SERVER_URL +
                              movie.movie_cover_path
                            }`}
                            alt="No Image"
                            className="w-100 p-0 m-0"
                            style={{ height: "50vh" }}
                          />
                        </div>
                        <div className="col">
                          <h2>{movie.title}</h2>
                          <h4>{movie.year}</h4>
                          <h4>{movie.genres}</h4>
                          <h4>{movie.actors}</h4>
                          <div>{movie.description}</div>
                        </div>
                      </div>
                    </div>
                    <h2 className="mx-3 mb-2">Ratings</h2>
                    {ratings.map((rating, i) => (
                      <div className="card m-2" key={i}>
                        <div className="card-body">
                          <h3 className="mb-1">{rating.rater_name}</h3>
                          <h4>
                            Rating Type : {rating.type}
                            <span> ({rating.num_of_stars + "/5"})</span>
                          </h4>
                          {rating.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    </>
  );
}
