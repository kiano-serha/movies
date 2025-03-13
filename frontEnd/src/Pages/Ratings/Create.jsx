import { useEffect } from "react";
import Toast from "../components/Toast";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { yupResolver } from "@hookform/resolvers/yup";
import RatingSchema from "../Validators/RatingSchema";
import Cookies from "js-cookie";

export default function Create() {
  const { id } = useParams();
  axios.defaults.withCredentials = true;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      movie_name: "",
      description: "",
      movie_id: id,
      num_of_stars: "",
    },
    resolver: yupResolver(RatingSchema),
  });

  const onSubmit = (data) => {
    axios
      .post(import.meta.env.VITE_SERVER_URL + "/users/add/rating", data, {headers: {Authorization: 'Bearer ' + Cookies.get("token")},})
      .then((res) => {
        if (res.data.message) {
          toast.success(res.data.message);
          reset();
        } else {
          toast.error(res.data.error);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_SERVER_URL + "/movies/" + id, {headers: {Authorization: 'Bearer ' + Cookies.get("token")},})
      .then((res) => {
        if (res.data) {
          setValue("movie_title", res.data.data[0].title);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  }, [id, setValue]);

  return (
    <div className="page">
      <Navbar PageName={"Add Ratings"} />
      <div className="page-wrapper">
        <div className="page-wrapper">
          <div className="page-header d-print-none">
            <div className="container-xl">
              <div className="page-title">Add Rating</div>
            </div>
          </div>
          <div className="page-body">
            <div className="container-xl">
              <div className="row row-cards">
                <div className="col">
                  <div className="card">
                    <div className="card-body">
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                          <label htmlFor="" className="form-label">
                            Movie Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            {...register("movie_title")}
                          />
                          <p className="text-danger fw-bold">
                            {errors.movie_title?.message}
                          </p>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="" className="form-label">
                            Description
                          </label>
                          <textarea
                            className="form-control"
                            {...register("description")}
                          ></textarea>
                          <p className="text-danger fw-bold">
                            {errors.description?.message}
                          </p>
                        </div>
                        <div className="mb-3">
                          <label htmlFor="" className="form-label">
                            Number of Stars
                          </label>
                          <select
                            name=""
                            id=""
                            className="form-select"
                            {...register("num_of_stars")}
                          >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                          <p className="text-danger fw-bold">
                            {errors.num_of_stars?.message}
                          </p>
                        </div>
                        <button className="btn btn-primary w-100">
                          Submit Review
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
