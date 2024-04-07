const movieDetails = JSON.parse(localStorage.getItem("selectedMovie"));

if (movieDetails) {
  const card = document.querySelector(".movie-details");
  card.querySelector(
    ".img"
  ).style.backgroundImage = `url(${movieDetails.Poster})`;
  card.querySelector(".title").textContent = movieDetails.Title;
  card.querySelector(
    ".rating"
  ).textContent = `Rating: ${movieDetails.imdbRating}`;
  card.querySelector(".description").textContent = movieDetails.Plot;
} else {
  window.location.href = "index.html";
}

document.getElementById("back-button").addEventListener("click", () => {
  window.location.href = "home.html";
});
