const token = import.meta.env.VITE_TMDB_TOKEN;

const BASE_URL = "https://api.themoviedb.org/3";

export async function getPopularMovies() {
  const respone = await fetch(`${BASE_URL}/movie/popular?language=en-US`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  if (!respone.ok) {
    throw new Error("failed to fetch popular movies");
  }

  const data = await respone.json();

  return data.results;
}

export async function getMovie(id) {
  const respone = await fetch(`${BASE_URL}/movie/${id}?language=en-US`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  if (!respone.ok) {
    throw new Error("failed to fetch movie");
  }

  const data = await respone.json();

  return data;
}

export async function searchMovies(search) {
  const respone = await fetch(
    `${BASE_URL}/search/movie?query=${encodeURIComponent(search)}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  );

  if (!respone.ok) {
    throw new Error("failed to fetch movie");
  }
  const data = await respone.json();

  return data.results;
}

// async function createMovie(movie) {
//   const respone = await fetch("http://localhost:8000/api/movies/", {
//     method: "Post",

//     headers: {
//       "content-type": "application/json",
//     },
    
//     body: JSON.stringify(movie)
//   });

//   if(!respone.ok) {
//     throw new Error("failed to create movie");
//   }

//   return await respone.json();
// }
