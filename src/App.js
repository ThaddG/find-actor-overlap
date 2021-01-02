import React, { useState } from "react";
import movieApi from "./api/movie";
import "./App.css";

const api_key = process.env.REACT_APP_API_KEY;

function App() {
  const [queryOne, setQueryOne] = useState("");
  const [queryTwo, setQueryTwo] = useState("");
  const [movies, setMovies] = useState([]);

  const getActorId = async (person) => {
    return new Promise((resolve, reject) => {
      movieApi
        .get("/search/person", { params: { api_key, query: person } })
        .then((actor) => {
          resolve(actor.data.results[0].id);
        })
        .catch(reject);
    });
  };

  const getMovieCredits = async (id) => {
    return new Promise((resolve, reject) => {
      movieApi
        .get(`/person/${id}/movie_credits`, { params: { api_key } })
        .then((movies) => {
          resolve(movies.data.cast);
        })
        .catch(reject);
    });
  };

  const getMoviesOverlap = async (personOne, personTwo) => {
    if (personOne === "" || personTwo === "") {
      return console.log("needs input");
    }

    let actor = await getActorId(personOne);
    const actorOneMovies = await getMovieCredits(actor);

    actor = await getActorId(personTwo);
    const actorTwoMovies = await getMovieCredits(actor);

    const movies = actorOneMovies.filter((movieOne) =>
      actorTwoMovies.some((movieTwo) => movieOne.id === movieTwo.id)
    );

    setMovies(movies);
  };

  return (
    <div className="App">
      <div className="input-container">
        <h1>Search Actor Overlap</h1>
        <input
          required
          type="text"
          name="queryOne"
          placeholder="hugh jackman"
          value={queryOne}
          onChange={(e) => setQueryOne(e.target.value)}
        />
        <input
          required
          type="text"
          name="queryTwo"
          placeholder="john travolta"
          value={queryTwo}
          onChange={(e) => setQueryTwo(e.target.value)}
        />
        <button
          style={{ width: "100px" }}
          onClick={() => getMoviesOverlap(queryOne, queryTwo)}
        >
          Search
        </button>
      </div>

      <div style={{ width: "500px", textAlign: "left" }}>
        {movies.map((movie) => (
          <div key={movie.id}>
            <li>
              <img
                src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
              />
              <div style={{ flex: 1, marginLeft: 10 }}>
                <p style={{ marginTop: 0, fontWeight: "bold" }}>
                  {movie.title} ({movie.release_date.slice(0, 4)})
                </p>
                <p style={{ fontStyle: "italic", fontSize: 12 }}>
                  {movie.overview}
                </p>
              </div>
            </li>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
