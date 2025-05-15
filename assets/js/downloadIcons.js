const iconMap = {
  windows:   { icon: "fa-brands fa-windows", label: "Download for Windows", type: "platform" },
  mac:       { icon: "fa-brands fa-apple", label: "Download for Mac", type: "platform" },
  android:       { icon: "fa-brands fa-android", label: "Download for Android", type: "platform" },
  web:       { icon: "fa-solid fa-globe", label: "Play in Browser", type: "play" },
  github:    { icon: "fa-brands fa-github", label: "View on GitHub", type: "link" },
  article:   { icon: "fa-solid fa-file-lines", label: "Read Paper", type: "info" },
  trailer:   { icon: "fa-solid fa-video", label: "Watch Trailer", type: "media" },
  itch:      { icon: "fa-brands fa-itch-io", label: "View on Itch.io", type: "platform" },
  steam:     { icon: "fa-brands fa-steam", label: "View on Steam", type: "platform" },
  devlog:    { icon: "fa-solid fa-pen-nib", label: "Read Devlog", type: "info" },
  site:      { icon: "fa-solid fa-up-right-from-square", label: "Visit Website", type: "link" }
};

function renderDownloadIcons(links) {
  const $container = $("#project-media-container");
  
  // Remover ícones antigos se existirem
  $container.find(".download-icons").empty();

  const $iconsWrapper = $("<div>").addClass("download-icons");

  links.forEach(link => {
    const iconInfo = iconMap[link.type];
    if (iconInfo) {
      const $icon = $("<a>")
        .attr("href", link.url)
        .attr("target", "_blank")
        .attr("title", iconInfo.label)
        .html(`<i class="${iconInfo.icon}"></i>`);
      $iconsWrapper.append($icon);
    }
  });

  $container.append($iconsWrapper);
}

