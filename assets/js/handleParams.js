// Utility to get a query parameter from the URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function removeQueryParam(param) {
  const url = new URL(window.location);
  url.searchParams.delete(param);
  history.replaceState({}, "", url);
}

function removeAllQueryParams() {
  const url = new URL(window.location);
  url.search = ""; // Limpa tudo
  history.replaceState({}, "", url);
}

function clickLink($navLink) {
  $('nav a').removeClass('active');
  $navLink.addClass('active');
  showSection($navLink.data("target"));
}

/*function clickLink(link) {
  link.click();

  showSection(link.data("target"));
}*/

// Load the correct game detail if "game" parameter is in the URL
$(document).ready(function() {
  const configs = [
    {
      param: "game",
      navSelector: 'nav a[data-target=games]',
      data: gameData,
      windowSelector: "#game-window",
      isGame: true,
    },
    {
      param: "project",
      navSelector: 'nav a[data-target=projects]',
      data: projectData,
      windowSelector: "#project-window",
      isGame: false,
    }
  ];

  configs.forEach(config => {
    const selectedItem = getQueryParam(config.param);

    if (selectedItem) {
      clickLink($(config.navSelector));
      setTimeout(() => {
        showWindowDetails(config.data, selectedItem, config.windowSelector, config.isGame);
      }, 800); //800
    }
  });
});
