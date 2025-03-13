import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { toast } from "sonner";
import Toast from "../components/Toast";
import Footer from "../components/Footer";

export default function RatingIndex() {
  axios.defaults.withCredentials = true;
  const [ratings, setRatings] = useState([
    {
      type: "",
      num_of_stars: "",
      description: "",
      title: "",
    },
  ]);
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_SERVER_URL + "/users/ratings")
      .then((res) => {
        if (res.data.message) {
          setRatings(res.data.data);
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  });
  return (
    <div className="page">
      <Navbar PageName={"View Movie"} />
      <div className="page-wrapper">
        <div className="page-header">
          <div className="container-xl">
            <div className="page-title">My Reviews</div>
          </div>
        </div>
        <div className="page-body">
          <div className="container-xl">
            {ratings.map((rating, i) => (
              <div className="card card-body mb-3" key={i}>
                <h2>{rating.title}</h2>
                <h3>{rating.type + " (" + rating.num_of_stars + "/5)"}</h3>
                <div>{rating.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
