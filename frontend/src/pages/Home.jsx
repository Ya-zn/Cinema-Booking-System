import MovieList from "../components/MovieList";
import { useState } from "react";
import { searchMovies } from "../services/tmdb";
import "./Home.css";

function Home({ movies, favorites, onFavorite }) {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function TMDBSearch() {
    if (!search.trim()) {
      setSearchResult([]);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await searchMovies(search);

      const searchedMovies = data.map((movie) => ({
        id: movie.id,
        title: movie.title,
        rating: movie.vote_average,
        year: movie.release_date?.slice(0, 4),
        poster: movie.poster_path,
      }));

      setSearchResult(searchedMovies);
      setHasSearched(true);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    TMDBSearch();
  }

  const displayedMovies = hasSearched
    ? searchResult
    : movies;

  return (
    <main className="home">

      <section className="home-hero">

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <span className="hero-badge">
            YOUR CINEMA. YOUR MOVIES.
          </span>

          <h1>
            Discover your next
            <span> favorite movie.</span>
          </h1>

          <p className="hero-description">
            Explore popular movies, discover new releases
            and keep your favorites together in one place.
          </p>

          <form
            className="movie-search"
            onSubmit={handleSubmit}
          >

            <div className="search-input-wrapper">

              <span className="search-icon">
                ⌕
              </span>

              <input
                type="text"
                placeholder="Search for a movie..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

              {search && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => {
                    setSearch("");
                    setSearchResult([]);
                    setHasSearched(false);
                    setError(null);
                  }}
                >
                  ×
                </button>
              )}

            </div>

            <button
              className="search-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Searching..."
                : "Search"}
            </button>

          </form>

        </div>

      </section>


      <section className="movies-section">

        <div className="movies-section-header">

          <div>

            <span className="section-label">
              EXPLORE
            </span>

            <h2>
              {hasSearched
                ? `Results for "${search}"`
                : "Popular Movies"}
            </h2>

          </div>

          <p className="movie-count">
            {displayedMovies.length} movies
          </p>

        </div>


        {error && (
          <div className="home-error">
            <div>
              <strong>
                Something went wrong
              </strong>

              <p>{error}</p>
            </div>
          </div>
        )}


        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>

            <p>
              Finding movies for you...
            </p>
          </div>
        ) : (
          <MovieList
            movies={displayedMovies}
            favorites={favorites}
            onFavorite={onFavorite}
          />
        )}

      </section>

    </main>
  );
}

export default Home;