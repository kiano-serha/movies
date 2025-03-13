const executeDBQuery = require("../services/database");

const addRating = async (req, res) => {
  try {
    const query_one = await executeDBQuery(
      "select first_name, last_name from users where id=?",
      [req.user_id]
    );
    if (query_one[0].length > 0) {
      const query_two = await executeDBQuery(
        "SELECT * FROM ratings where user_id = ? and movie_id = ? and rating_type_id = 3",
        [req.user_id, req.body.movie_id]
      );

      if (query_two[0].length == 0) {
        const query_three = await executeDBQuery(
          "INSERT INTO ratings(movie_id, rating_type_id, user_id, rater_first_name, rater_last_name, description, num_of_stars, created_at) VALUES(?,?,?,?,?,?,?, ?)",
          [
            req.body.movie_id,
            3,
            req.user_id,
            query_one[0][0].first_name,
            query_one[0][0].last_name,
            req.body.description,
            req.body.num_of_stars,
            new Date(),
          ]
        );
        if (query_three[0].affectedRows > 0) {
          return res.json({ message: "Rating has been added successfully" });
        } else {
          throw new Exception("Error adding this rating");
        }
      } else {
        throw new Error("Your rating has already been entered for this movie");
      }
    } else {
      throw new Error("This user not longer exists");
    }
  } catch (ex) {
    return res.json({ error: ex.message });
  }
};

const getRatings = async (req, res) => {
  try {
    const query_two = await executeDBQuery(
      "SELECT concat(ratings.rater_first_name, ' ', ratings.rater_last_name) as rater_name, rating_types.type, ratings.num_of_stars, ratings.description, movies.title from ratings LEFT JOIN rating_types ON ratings.rating_type_id = rating_types.id LEFT JOIN movies ON movies.id = ratings.movie_id WHERE ratings.user_id = ?",
      [req.user_id]
    );

    return res.json({ message: "success", data: query_two[0] });
  } catch (ex) {
    return res.json({ error: ex.message });
  }
};

module.exports = {
  addRating,
  getRatings,
};
