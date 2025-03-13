const executeDBQuery = require("../services/database");

require("dotenv").config();

const getAll = async (req, res) => {
  try {
    query_one = await executeDBQuery(
      "select movies.id, movies.title, movies.year, movies.movie_cover_path, group_concat(distinct genres.name) as genres from movies LEFT JOIN movie_genres ON movies.id = movie_genres.movie_id LEFT JOIN genres ON movie_genres.genre_id = genres.id group by movies.id",
      []
    );
    return res.json({ data: query_one[0] });
  } catch (ex) {
    return res.json({ error: ex.message });
  }
};

const getWatched = async (req, res) => {
  try {
    const query_one = await executeDBQuery(
      "select movies.id, movies.title, movies.year, movies.movie_cover_path, group_concat(distinct genres.name) as genres from movies LEFT JOIN movie_genres ON movies.id = movie_genres.movie_id LEFT JOIN genres ON movie_genres.genre_id = genres.id LEFT JOIN user_watched ON user_watched.movie_id = movies.id WHERE user_watched.user_id = ? group by movies.id;",
      [req.user_id]
    );
    return res.json({ data: query_one[0] });
  } catch (ex) {
    return res.json({ error: ex.message });
  }
};

const searchMovie = async (req, res) => {
  try {
    if (req.body.criteria == 2) {
      const query = await executeDBQuery(
        "select movies.id, movies.title, movies.year, movies.movie_cover_path, group_concat(distinct genres.name) as genres from movies LEFT JOIN movie_genres ON movies.id = movie_genres.movie_id LEFT JOIN genres ON movie_genres.genre_id = genres.id where " +
          (isNaN(req.body.search_value) == true
            ? "movies.title like ?"
            : "movies.id = ?") +
          " group by movies.id",
        [
          isNaN(req.body.search_value) == true
            ? `%${req.body.search_value}%`
            : req.body.search_value,
        ]
      );
      return res.json({ message: "success", data: query[0] });
    } else if (req.body.criteria == 3) {
      const query = await executeDBQuery(
        "select movies.id, movies.title, movies.year, movies.movie_cover_path, group_concat(distinct genres.name) as genres, group_concat(distinct actors.first_name,' ' ,actors.last_name) as actor_name from movies LEFT JOIN movie_genres ON movies.id = movie_genres.movie_id LEFT JOIN genres ON movie_genres.genre_id = genres.id LEFT JOIN movie_actors ON movies.id = movie_actors.movie_id LEFT JOIN actors ON actors.id = movie_actors.actor_id where " +
          (isNaN(req.body.search_value) == true
            ? "actors.first_name like ? or actors.last_name like ?"
            : "movie_actors.actor_id = ?") +
          " group by movies.id",
        isNaN(req.body.search_value) == true
          ? [`%${req.body.search_value}%`, `%${req.body.search_value}%`]
          : [req.body.search_value]
      );
      return res.json({ message: "success", data: query[0] });
    } else if (req.body.criteria == 4) {
      const query = await executeDBQuery(
        "select movies.id, movies.title, movies.year, movies.movie_cover_path, group_concat(distinct genres.name) as genres from movies LEFT JOIN movie_genres ON movies.id = movie_genres.movie_id LEFT JOIN genres ON movie_genres.genre_id = genres.id LEFT JOIN movie_publishers ON movies.id = movie_publishers.movie_id LEFT JOIN publishers ON movie_publishers.publisher_id = publishers.id WHERE " +
          (isNaN(req.body.search_value) == true
            ? "publishers.name like ?"
            : "publisher_id = ?") +
          " group by movies.id",
        [
          isNaN(req.body.search_value) == true
            ? `%${req.body.search_value}%`
            : req.body.search_value,
        ]
      );
      return res.json({ message: "success", data: query[0] });
    } else if (req.body.criteria == 5) {
      const query = await executeDBQuery(
        "select movies.id, movies.title, movies.year, movies.movie_cover_path, group_concat(distinct genres.name) as genres from movies LEFT JOIN movie_genres ON movies.id = movie_genres.movie_id LEFT JOIN genres ON movie_genres.genre_id = genres.id where " +
          (isNaN(req.body.search_value) == true
            ? "genres.name like ?"
            : "movie_genres.genre_id = ?") +
          " group by movies.id",
        [
          isNaN(req.body.search_value) == true
            ? `%${req.body.search_value}%`
            : req.body.search_value,
        ]
      );
      return res.json({ message: "success", data: query[0] });
    }
  } catch (ex) {
    return res.json({ error: ex.message });
  }
};

const getMovieName = async (req, res) => {
  try {
    const query = await executeDBQuery(
      "SELECT title from movies WHERE id = ?",
      [req.params.id]
    );

    return res.json({ message: "success", data: query[0] });
  } catch (ex) {
    return res.json({ error: ex.message });
  }
};

const getMovieInfo = async (req, res) => {
  try {
    const query_one = await executeDBQuery(
      "select movies.id, movies.title, movies.year, movies.movie_cover_path, group_concat(distinct genres.name) as genres from movies LEFT JOIN movie_genres ON movies.id = movie_genres.movie_id LEFT JOIN genres ON movie_genres.genre_id = genres.id where movies.id = ? group by movies.id",
      [req.params.id]
    );

    const query_two = await executeDBQuery(
      "SELECT concat(ratings.rater_first_name, ' ', ratings.rater_last_name) as rater_name, rating_types.type, ratings.num_of_stars, ratings.description from ratings LEFT JOIN rating_types ON ratings.rating_type_id = rating_types.id WHERE ratings.movie_id = ?",
      [req.params.id]
    );

    return res.json({
      movie: query_one[0][0],
      ratings: query_two[0],
      message: "success",
    });
  } catch (ex) {
    return res.json({ error: ex.message });
  }
};

const populateFilter = async (req, res) => {
  try {
    if (req.params.id == 2) {
      const query = await executeDBQuery(
        "SELECT id as value, title as label FROM movies WHERE deleted_at IS NULL"
      );
      return res.json({ message: "success", data: query[0] });
    } else if (req.params.id == 3) {
      const query = await executeDBQuery(
        "SELECT id as value, concat(first_name, ' ', last_name) as label from actors WHERE deleted_at IS NULL",
        []
      );
      return res.json({ message: "success", data: query[0] });
    } else if (req.params.id == 4) {
      const query = await executeDBQuery(
        "SELECT id as value, name as label from publishers WHERE deleted_at IS NULL",
        []
      );
      return res.json({ message: "success", data: query[0] });
    } else if (req.params.id == 5) {
      const query = await executeDBQuery(
        "SELECT id as value, name as label from genres WHERE deleted_at is NULL",
        []
      );
      return res.json({ message: "success", data: query[0] });
    } else {
      throw new Error("This criteria does not exist");
    }
  } catch (ex) {
    return res.json({ error: ex.message });
  }
};

const addWatched = async (req, res) => {
  try {
    const query_one = await executeDBQuery(
      "SELECT * from movies WHERE id = ?",
      [req.params.movie_id]
    );

    if (query_one[0].length > 0) {
      const query_two = await executeDBQuery(
        "SELECT * FROM user_watched WHERE user_id = ? and movie_id = ?",
        [req.user_id, req.params.movie_id]
      );
      if (query_two[0].length == 0) {
        const query_three = await executeDBQuery(
          "INSERT INTO user_watched(movie_id, user_id, created_at) VALUES(?,?,?)",
          [req.params.movie_id, req.user_id, new Date()]
        );
        if (query_three[0].affectedRows > 0) {
          return res.json({ message: "Movie successfully added to watched" });
        } else {
          throw new Error("Error adding to favorites");
        }
      } else {
        throw new Error("This movie has already been added to watched");
      }
    } else {
      throw new Error("This movie no longer exists in the database");
    }
  } catch (ex) {
    return res.json({ error: ex.message });
  }
};

//Add Ratings
const addMovies = async (req, res) => {
  try {
    query_one = await executeDBQuery(
      "SELECT * FROM movies where id = ? and year = ?",
      [req.body.movie_id, req.body.year]
    );

    if (query_one[0].length == 0) {
      const query_two = await executeDBQuery(
        "INSERT INTO movies(title, year, movie_cover_path, created_at)",
        [req.body.title, req.body.year, req.body.movie_cover_path, new Date()]
      );
      if (query_two[0].affectedRows > 0) {
        const query_three = await executeDBQuery(
          "SELECT id from movies WHERE year = ? and title = ?",
          [req.body.year, req.body.title]
        );
        req.body.genre_ids.foreach(async (genre_id) => {
          await executeDBQuery(
            "INSERT into movie_genres(movie_id, genre_id, created_at) VALUES (?,?,?)",
            [query_three[0][0].id, genre_id, new Date()]
          );
        });
        req.body.actor_ids.foreach(async (actor_id) => {
          await executeDBQuery(
            "INSERT into movie_actors(movie_id, actor_id, created_at) VALUES(?,?,?)",
            [query_three[0][0].id, actor_id, new Date()]
          );
        });
      } else {
        throw new Exception("Error adding movie");
      }
    } else {
      throw new Error("This movie has already been entered");
    }
  } catch (ex) {
    return res.json({ error: ex.message });
  }
};
module.exports = {
  getAll,
  getWatched,
  addWatched,
  addMovies,
  populateFilter,
  searchMovie,
  getMovieName,
  getMovieInfo,
};
