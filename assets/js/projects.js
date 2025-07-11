function getProjectById(id) {
  return projects.find(p => p.id === id);
}

function openProjectModal(id) {
  const project = getProjectById(id);
  if (!project) return;

  $("#project-title").text(project.title);
  $("#project-description").text(project.description);
  $("#project-image").attr("src", project.image);

  const $linksDiv = $("#project-links");
  $linksDiv.empty();
  project.links.forEach(link => {
    const $a = $("<a>")
      .attr("href", link.url)
      .attr("target", "_blank")
      .text(link.label);
    $linksDiv.append($a);
  });

  const $modal = $(".project.detail-modal");
  $modal.removeClass("hidden");
  setTimeout(() => $modal.addClass("show"), 10);
}

function closeProjectModal() {
  const $modal = $(".project.detail-modal");
  $modal.removeClass("show");
  setTimeout(() => $modal.addClass("hidden"), 300);
}



const projects = [
  {
    id: "anamara2",
    title: "Anamara 2",
    description: "Workshop Leader at TUMO, guiding students during workshops at developing Game Design and Programming skills within the Unity Game Engine.",
    image: "assets/images/00_projects/tumo.png",
    links: [
      { label: "Official Site", url: "https://example.com/anamara2" },
      { label: "IndieDev Award 2023", url: "https://example.com/award" }
    ]
  },
  // Add more projects here
];

function getProjectById(id) {
  return projects.find(p => p.id === id);
}
