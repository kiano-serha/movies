const express = require("express");
const {
  getAll,
  addMovies,
  populateFilter,
  searchMovie,
  addWatched,
  getMovieName,
  getMovieInfo,
  getWatched,
} = require("../controllers/movieController");
const router = express.Router();

router.get("/watched", getWatched);
router.get("/add/watched/:movie_id", addWatched);
router.get("/all", getAll);
router.post("/add", addMovies);
router.get("/populate/filter/:id", populateFilter);
router.post("/search", searchMovie);
router.get("/info/:id", getMovieInfo);
router.get("/:id", getMovieName);

module.exports = router;
