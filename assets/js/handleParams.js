// Utility to get a query parameter from the URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function removeQueryParam(param) {
  const url = new URL(window.location); // copia o URL atual
  url.searchParams.delete(param);       // remove o parâmetro
  history.replaceState({}, "", url);    // substitui o URL sem recarregar
}

// Load the correct game detail if "game" parameter is in the URL
document.addEventListener("DOMContentLoaded", () => {
  const selectedGame = getQueryParam("game");

  if (selectedGame) {
    // Wait 800ms before running the detail display
    setTimeout(() => {
      showGameDetails(selectedGame);
    }, 800);
  }
});
