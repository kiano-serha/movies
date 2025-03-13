import * as yup from "yup";

const RatingSchema = yup.object().shape({
  movie_title: yup.string().required("Movie Title is a required field"),
  description: yup.string().required("Description is a required field"),
  num_of_stars: yup.string().required("Number of stars is required"),
});

export default RatingSchema;
