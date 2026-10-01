import { Link } from "react-router";
import "./MovieCard.css";

function MovieCard({ movie, onFavorite, favorites }) {
  const isFavorite = favorites.some(
    (favorite) => favorite.id === movie.id
  );

  return (
    <article className="movie-card">

      <div className="movie-poster-wrapper">
        {movie.poster ? (
          <img
            className="movie-poster"
            src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
            alt={movie.title}
          />
        ) : (
          <div className="poster-placeholder">
            <span>🎬</span>
            <p>No poster available</p>
          </div>
        )}

        <div className="poster-overlay"></div>

        <div className="movie-rating-badge">
          <span>★</span>

          {movie.rating
            ? Number(movie.rating).toFixed(1)
            : "N/A"}
        </div>

        <button
          className={`favorite-button ${
            isFavorite ? "favorite-active" : ""
          }`}
          onClick={() => onFavorite(movie)}
          aria-label={
            isFavorite
              ? "Remove from favorites"
              : "Add to favorites"
          }
        >
          {isFavorite ? "♥" : "♡"}
        </button>

        <Link
          className="poster-details-link"
          to={`/movieDetails/${movie.id}`}
        >
          View Details
        </Link>
      </div>

      <div className="movie-card-content">
        <h2 title={movie.title}>
          {movie.title}
        </h2>

        <div className="movie-meta">
          <span>{movie.year || "Unknown year"}</span>

          <span className="meta-dot"></span>

          <span>Movie</span>
        </div>

        <div className="movie-card-footer">
          <div className="footer-rating">
            <span className="rating-star">★</span>

            <span>
              {movie.rating
                ? Number(movie.rating).toFixed(1)
                : "N/A"}
            </span>

            <small>/ 10</small>
          </div>

          <button
            className={`favorite-text-button ${
              isFavorite ? "remove-favorite" : ""
            }`}
            onClick={() => onFavorite(movie)}
          >
            {isFavorite
              ? "Remove"
              : "Favorite"}
          </button>
        </div>
      </div>

    </article>
  );
}

export default MovieCard;