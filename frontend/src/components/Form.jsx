import { useState } from "react";
import "./Form.css";

function Form({ onAddMovie }) {
  const [formData, setFormData] = useState({
    title: "",
    rating: "",
    year: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.title.trim()) {
      return;
    }

    const rating = Number(formData.rating);
    const year = Number(formData.year);

    if (rating < 0 || rating > 10) {
      return;
    }

    const newMovie = {
      id: Date.now(),
      title: formData.title.trim(),
      rating,
      year,
    };

    onAddMovie(newMovie);

    setFormData({
      title: "",
      rating: "",
      year: "",
    });
  }

  return (
    <main className="add-movie-page">

      <section className="add-movie-intro">
        <span className="form-eyebrow">
          CINEMA MANAGEMENT
        </span>

        <h1>Add a new movie</h1>

        <p>
          Create a movie entry and add it directly to your
          cinema collection.
        </p>
      </section>


      <section className="form-section">

        <div className="form-card">

          <div className="form-card-header">

            <div className="form-icon">
              +
            </div>

            <div>
              <h2>Movie information</h2>

              <p>
                Enter the basic details of the movie below.
              </p>
            </div>

          </div>


          <form
            className="add-movie-form"
            onSubmit={handleSubmit}
          >

            <div className="form-group form-group-full">

              <label htmlFor="movie-title">
                Movie title
              </label>

              <div className="input-container">

                <input
                  id="movie-title"
                  type="text"
                  name="title"
                  placeholder="e.g. Interstellar"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

              </div>

              <span className="form-hint">
                Enter the official movie title.
              </span>

            </div>


            <div className="form-row">

              <div className="form-group">

                <label htmlFor="movie-rating">
                  Rating
                </label>

                <div className="input-container input-with-symbol">

                  <span className="input-symbol rating-symbol">
                    ★
                  </span>

                  <input
                    id="movie-rating"
                    type="number"
                    name="rating"
                    placeholder="8.7"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleChange}
                    required
                  />

                </div>

                <span className="form-hint">
                  Rating from 0 to 10.
                </span>

              </div>


              <div className="form-group">

                <label htmlFor="movie-year">
                  Release year
                </label>

                <div className="input-container">

                  <input
                    id="movie-year"
                    type="number"
                    name="year"
                    placeholder="2014"
                    min="1888"
                    max="2100"
                    value={formData.year}
                    onChange={handleChange}
                    required
                  />

                </div>

                <span className="form-hint">
                  Enter the movie release year.
                </span>

              </div>

            </div>


            <div className="form-preview">

              <span className="preview-label">
                PREVIEW
              </span>

              <div className="preview-content">

                <div className="preview-poster">
                  <span>🎬</span>
                </div>

                <div className="preview-info">

                  <h3>
                    {formData.title || "Movie title"}
                  </h3>

                  <div className="preview-meta">

                    <span>
                      ★ {formData.rating || "0.0"}
                    </span>

                    <span className="preview-dot"></span>

                    <span>
                      {formData.year || "Year"}
                    </span>

                  </div>

                </div>

              </div>

            </div>


            <div className="form-actions">

              <button
                type="button"
                className="reset-button"
                onClick={() =>
                  setFormData({
                    title: "",
                    rating: "",
                    year: "",
                  })
                }
              >
                Clear
              </button>

              <button
                type="submit"
                className="submit-movie-button"
              >
                <span>+</span>
                Add Movie
              </button>

            </div>

          </form>

        </div>

      </section>

    </main>
  );
}

export default Form;