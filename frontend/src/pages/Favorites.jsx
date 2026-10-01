import MovieList from "../components/MovieList";
import "./Favorites.css";

function Favorites({ favorites, onFavorite }) {
  return (
    <main className="favorites-page">

      <section className="favorites-header">
        <span className="favorites-label">
          YOUR COLLECTION
        </span>

        <h1>My Favorites</h1>

        <p>
          Keep track of the movies you love and come back to them anytime.
        </p>

        <div className="favorites-count">
          <strong>{favorites.length}</strong>
          <span>
            {favorites.length === 1 ? "movie" : "movies"}
          </span>
        </div>
      </section>


      <section className="favorites-content">

        {favorites.length === 0 ? (
          <div className="favorites-empty">

            <div className="empty-icon">
              ♡
            </div>

            <h2>No favorites yet</h2>

            <p>
              Movies you add to your favorites will appear here.
            </p>

          </div>
        ) : (
          <MovieList
            movies={favorites}
            favorites={favorites}
            onFavorite={onFavorite}
          />
        )}

      </section>

    </main>
  );
}

export default Favorites;