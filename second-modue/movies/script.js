const apiKey = "2fa96acc";
const baseUrl = "http://www.omdbapi.com/";
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const searchTerm = searchInput.value;
  const response = await fetch(`${baseUrl}?apikey=${apiKey}&s=${searchTerm}`);
  const data = await response.json();

  if (data.Search && data.Search.length > 0) {
    const firstResult = data.Search[0];
    const movieId = firstResult.imdbID;
    const movieResponse = await fetch(
      `${baseUrl}?apikey=${apiKey}&i=${movieId}`
    );
    const movieData = await movieResponse.json();

    localStorage.setItem("selectedMovie", JSON.stringify(movieData));

    window.location.href = "movie_details.html";
  }
});
// ------------------------------------------------------------------------------------------------

const truncateDescription = (description, maxLength) => {
  const words = description.split(" ");
  if (words.length <= maxLength) return description;
  const truncated = words.slice(0, maxLength).join(" ");
  return truncated + " ...";
};

async function fetchTopRatedMovies() {
  try {
    const response = await fetch(
      `${baseUrl}?apikey=${apiKey}&s=movie&type=movie&r=json`
    );
    const data = await response.json();
    const movies = data.Search.slice(0, 3);

    const container = document.getElementById("top-rated-movies-container");
    for (const movie of movies) {
      const imdbId = movie.imdbID;
      const movieResponse = await fetch(
        `${baseUrl}?apikey=${apiKey}&i=${imdbId}&plot=full&r=json`
      );
      const movieData = await movieResponse.json();

      const card = document.createElement("div");
      card.classList.add("movie-card");
      card.innerHTML = `
          <img src="${movieData.Poster}" alt="${
        movieData.Title
      }" class="movie-image">
          <div class="movie-details">
              <div class="movie-title">${movieData.Title}</div>
              <p>Year: ${movieData.Year}</p>
              <p>IMDb Rating: ${movieData.imdbRating}</p>
              <p><span class="description-truncated">${truncateDescription(
                movieData.Plot,
                10
              )}</span></p>
              <button class="view-more-btn">View More</button>
              <p class="full-description" style="display:none">${
                movieData.Plot
              }</p>
              <p><a href="https://www.imdb.com/title/${imdbId}/" target="_blank">IMDb Link</a></p>
          </div>
        `;

      const viewMoreBtn = card.querySelector(".view-more-btn");
      viewMoreBtn.addEventListener("click", () => {
        const fullDescription = card.querySelector(".full-description");
        const truncatedDescription = card.querySelector(
          ".description-truncated"
        );
        if (fullDescription.style.display === "none") {
          fullDescription.style.display = "block";
          truncatedDescription.style.display = "none";
          viewMoreBtn.textContent = "Show Less";
        } else {
          fullDescription.style.display = "none";
          truncatedDescription.style.display = "block";
          viewMoreBtn.textContent = "View More";
        }
      });

      container.appendChild(card);
    }
  } catch (error) {
    console.error("Error fetching movie data:", error);
  }
}

fetchTopRatedMovies();
