import MovieCard from "./MovieCard";
import "./MovieList.css";

function MovieList({ movies, onFavorite, favorites }) {
  if (movies.length === 0) {
    return (
      <div className="movies-empty-state">
        <span>🎬</span>
        <h3>No movies found</h3>
        <p>Try searching for another movie.</p>
      </div>
    );
  }

  return (
    <section className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onFavorite={onFavorite}
          favorites={favorites}
        />
      ))}
    </section>
  );
}

export default MovieList;