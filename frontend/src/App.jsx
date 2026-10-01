import Navbar from "./components/Navbar";
import Home from "./pages/home";
import Favorites from "./pages/favorites";
import MovieDetails from "./pages/MovieDetails";
import Form from "./components/Form";
import { getPopularMovies } from "./services/tmdb";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router";

function App() {
  
  const [favorites, setFavorites] = useState([]);
  const [movies, setMovies] = useState([]);


    useEffect(() => {
      async function getMovie() {
        try {
          const data = await getPopularMovies();
  
          const movies = data.map(movie =>({
            id : movie.id,
            title : movie.title,
            rating : movie.vote_average,
            year : movie.release_date?.slice(0, 4),
            poster : movie.poster_path
  
          }));
  
          setMovies(movies);
          setLoading(false);
  
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      }
      getMovie();
    }, []);
  
 
  function handleFavorite(movie) {
    setFavorites((prevFavorites) => {
      const alreadyFavorites = prevFavorites.some(
        (favorite) => favorite.id === movie.id,
      );

      if (alreadyFavorites) {
        return prevFavorites.filter((favorite) => favorite.id !== movie.id);
      }

      return [...prevFavorites, movie];
    });

  }
  function handleAddMovie(movie) {
  setMovies(prevMovies => [
      ...prevMovies,
      movie
  ]);

  }

  return (
    <>
      <Navbar favoriteCounte={favorites.length} />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              movies={movies}
              favorites={favorites}
              onFavorite={handleFavorite}
            />
          }
        />

        <Route
          path="/favorites"
          element={
            <Favorites 
              favorites={favorites} 
              onFavorite={handleFavorite} />
          }
        />

        <Route 
          path="/movieDetails/:id"
          element = {<MovieDetails />}
        />

        <Route
          path = "/addMovie"
          element = {<Form onAddMovie ={handleAddMovie}/>}
        />
      </Routes>
    </>
  );
}

export default App;
