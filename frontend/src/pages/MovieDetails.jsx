import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import { getMovie } from "../services/tmdb";
import "./MovieDetails.css";

function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getMovieDetails() {
      try {
        setLoading(true);
        setError(null);

        const data = await getMovie(id);

        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    getMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <main className="details-state">
        <div className="details-loader"></div>
        <p>Loading movie details...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="details-state">
        <span className="details-state-icon">!</span>

        <h1>Something went wrong</h1>

        <p>{error}</p>

        <Link to="/" className="details-back-button">
          Back to movies
        </Link>
      </main>
    );
  }

  if (!movie) {
    return (
      <main className="details-state">
        <span className="details-state-icon">🎬</span>

        <h1>Movie not found</h1>

        <Link to="/" className="details-back-button">
          Back to movies
        </Link>
      </main>
    );
  }

  const releaseYear = movie.release_date?.slice(0, 4);

  const runtimeHours = Math.floor(movie.runtime / 60);
  const runtimeMinutes = movie.runtime % 60;

  return (
    <main className="movie-details-page">

      <section
        className="details-hero"
        style={
          movie.backdrop_path
            ? {
                backgroundImage: `
                  linear-gradient(
                    to bottom,
                    rgba(8, 9, 12, 0.18),
                    rgba(8, 9, 12, 0.75) 70%,
                    #08090c 100%
                  ),
                  linear-gradient(
                    to right,
                    rgba(8, 9, 12, 0.94),
                    rgba(8, 9, 12, 0.35)
                  ),
                  url(
                    https://image.tmdb.org/t/p/original${movie.backdrop_path}
                  )
                `,
              }
            : undefined
        }
      >

        <div className="details-hero-content">

          <Link
            to="/"
            className="details-back-link"
          >
            ← Back to movies
          </Link>


          <div className="details-layout">

            <div className="details-poster-container">

              {movie.poster_path ? (
                <img
                  className="details-poster"
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                />
              ) : (
                <div className="details-poster-placeholder">
                  🎬
                </div>
              )}

            </div>


            <div className="details-info">

              {movie.status && (
                <span className="details-status">
                  {movie.status}
                </span>
              )}

              <h1>{movie.title}</h1>

              {movie.tagline && (
                <p className="movie-tagline">
                  "{movie.tagline}"
                </p>
              )}


              <div className="details-meta">

                <div className="details-rating">
                  <span>★</span>

                  <strong>
                    {movie.vote_average
                      ? movie.vote_average.toFixed(1)
                      : "N/A"}
                  </strong>

                  <small>/ 10</small>
                </div>


                {releaseYear && (
                  <span>{releaseYear}</span>
                )}


                {movie.runtime > 0 && (
                  <span>
                    {runtimeHours > 0 &&
                      `${runtimeHours}h `}
                    {runtimeMinutes}m
                  </span>
                )}

              </div>


              {movie.genres?.length > 0 && (
                <div className="details-genres">
                  {movie.genres.map((genre) => (
                    <span key={genre.id}>
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}


              <div className="overview-section">

                <span className="details-section-label">
                  STORYLINE
                </span>

                <h2>Overview</h2>

                <p>
                  {movie.overview ||
                    "No overview is available for this movie."}
                </p>

              </div>


              <div className="details-facts">

                <div className="detail-fact">
                  <span>Release Date</span>

                  <strong>
                    {movie.release_date ||
                      "Unknown"}
                  </strong>
                </div>


                <div className="detail-fact">
                  <span>Original Language</span>

                  <strong>
                    {movie.original_language
                      ? movie.original_language.toUpperCase()
                      : "Unknown"}
                  </strong>
                </div>


                <div className="detail-fact">
                  <span>Popularity</span>

                  <strong>
                    {movie.popularity
                      ? Math.round(movie.popularity)
                      : "N/A"}
                  </strong>
                </div>


                <div className="detail-fact">
                  <span>Votes</span>

                  <strong>
                    {movie.vote_count
                      ? movie.vote_count.toLocaleString()
                      : "0"}
                  </strong>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default MovieDetails;