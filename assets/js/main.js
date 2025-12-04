function showSection(id) {
  document.querySelectorAll("main section").forEach(section => {
    section.classList.remove("active");
    section.style.display = "none";
  });

  const target = document.getElementById(id);
  target.style.display = "block";

  setTimeout(() => target.classList.add("active"), 10);
}

document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    $('nav a').removeClass('active');
    $(this).addClass('active');
    showSection(link.dataset.target);
  });
});

$(document).ready(function () {
  const $underline = $('.underline');
  const $menuItems = $('nav a');
  let currentActive = $('nav a.active').first();

  // Forçar atualização após um breve delay quando a orientação mudar
  $(window).on('resize orientationchange', function() {
    setTimeout(() => {
      if (currentActive && currentActive.length) {
        updateUnderline(currentActive);
      }
    }, 300);
  });

  function updateUnderline($item) {
    currentActive = $('nav a.active').first();

    const offset = $item.position();
    const width = $item.outerWidth();
    $underline.css({
      width: width,
      transform: `translateX(${offset.left}px)`
    });
  }

  // Inicializa com o item ativo
  const $initialActive = $('nav a.active');
  if ($initialActive.length) updateUnderline($initialActive);

  $menuItems.on('click', function () {
    $menuItems.removeClass('active');
    $(this).addClass('active');
    updateUnderline($(this));
  });
});

function renderDownloadIcons(links, windowElement) {
  const $window = $(windowElement);
  const $container = $window.find(".download-icons");

  // Remover ícones antigos se existirem
  $container.empty();

  links.forEach(link => {
    const iconInfo = iconMap[link.type];
    if (iconInfo) {
      const $icon = $("<a>")
      .attr("href", link.url)
      .attr("target", "_blank")
      .attr("title", iconInfo.label)
      .html(`<i class="${iconInfo.icon}"></i>`);
      $container.append($icon);
    }
  });
}

$("#games .card").on("click", function () {
  const id = $(this).data("id");
  showWindowDetails(gameData, id, "#game-window", true);
});

$("#projects .card").on("click", function () {
  const id = $(this).data("id");
  showWindowDetails(projectData, id, "#project-window", false);
});

function showWindowDetails(gameData, id, windowElement, galleryExpanded) {
  const data = gameData[id];

  // Seleciona elementos DENTRO da janela específica
  const $window = $(windowElement);

  // Atualiza conteúdo textual
  $window.find(".project-title").text(data.title);
  $window.find(".project-description").text(data.description);

  // Media container
  const $mediaContainer = $window.find(".media-container");
  $mediaContainer.empty();
  const imageSrc = `assets/images/0_covers/${id}.webp`;

  // Renderiza botões de download
  renderDownloadIcons(data.links || [], windowElement);

  // Lógica de vídeo/imagem
  if (data.video) {
    const $img = $("<img>")
    .attr("src", imageSrc)
    .css("cursor", "pointer")
    .on("click", function () {
      const videoId = getYouTubeID(data.video);
      const $iframe = $("<iframe>")
      .attr("src", `https://www.youtube.com/embed/${videoId}?autoplay=1`)
      .attr("frameborder", "0")
      .attr("allow", "autoplay; encrypted-media")
      .attr("allowfullscreen", true);

      $mediaContainer.find(".video-thumb").fadeOut(300, function () {
        $(this).replaceWith($iframe.hide());
        $iframe.fadeIn(300);
      });
    });

    const $wrapper = $("<div>").addClass("video-thumb");
    const $playBtn = $("<div>").addClass("play-button");
    $wrapper.append($img).append($playBtn);

    addImageLoader($img);
    $mediaContainer.append($wrapper);
  } else {
    const $img = $("<img>")
    .attr("src", imageSrc);

    const $wrapper = $("<div>").css("position", "relative");
    $wrapper.append($img);

    addImageLoader($img);
    $mediaContainer.append($wrapper);
  }

  // Mostra a janela
  $("body").css("overflow", "hidden");
  $(".overlay").addClass("visible");
  $window.addClass("visible");

  // Tags
  const tags = data.tags || [];
  const $tagContainer = $window.find(".tag-container");
  $tagContainer.empty();

  tags.forEach(tagKey => {
    let label, type, $tag;

    if (tagKey.startsWith("years:")) {
      label = tagKey.split(":")[1];
      type = "year";
      $tag = $("<span>")
      .addClass("tag")
      .addClass(type)
      .text(label);
    } else {
      const tagInfo = tagDefinitions[tagKey];
      label = tagInfo?.label || tagKey;
      type = tagInfo?.type || "other";

      if (type === "project" && tagInfo.url) {
        $tag = $("<a>")
        .addClass("tag")
        .addClass(type)
        .attr("target", tagInfo.target ?? "")
        .attr("href", tagInfo.url)
        .attr("rel", "noopener noreferrer")
        .text(label);

        if (tagInfo.target === "_blank") {
          $tag
          .addClass("ext-link");
        }
        else {
          $tag
          .addClass("int-link");
        }
      } else {
        $tag = $("<span>")
        .addClass("tag")
        .addClass(type)
        .text(label);
      }
    }

    $tagContainer.append($tag);
  });

  // Eventos
  const eventsData = data.events || [];
  const eventsIcon = eventsData.icon || '📅';
  const eventsTitle = `
  <span style='font-size: 1rem'>${eventsIcon}</span>
  ${eventsData.title || 'Project Events & Participation'}
  `;
  const events = eventsData.list || [];
  const $eventsContainer = $window.find(".project-events");
  $eventsContainer.empty();

  if (events.length > 0) {
    $eventsContainer.show();

    const $eventsHeader = $(`
    <div class="events-header">
    <h4>${eventsTitle}
      <div class="events-toggle">
      <i class="fas fa-chevron-down"></i>
    </div>
    </h4>
    </div>
    `);

    const $eventsList = $('<div class="events-list"></div>');

    events.forEach(event => {
      const $eventItem = $(`
      <div class="event-item ${event.type || ''}">
      <div class="event-icon">${event.icon || '📅'}</div>
      <div class="event-content">
      <div class="event-title">${event.title}</div>
      ${event.description ? `<div class="event-description">${event.description}</div>` : []}
      <div class="event-details">
      ${event.date ? `<div class="event-date">${event.date}</div>` : []}
      ${event.location ? `<span class="event-location">${event.location}</span>` : []}
      ${event.link ? `<a class="event-link ${event.link.target === "_blank" ? "ext-link" : "int-link"}"
      href="${event.link.url}" ${event.link.target ? `target="${event.link.target}"` : []}>${event.link.title}</a>` : []}
      </div>
      </div>
      </div>
      `);

      $eventsList.append($eventItem);
    });

    $eventsContainer.append($eventsList);

    // Adiciona o clique para expandir/encolher a secção completa
    $eventsHeader.on('click', function() {
      $eventsList.slideToggle(450);
      $eventsHeader.find('.events-toggle i').toggleClass('fa-chevron-down fa-chevron-up');
    });

    $eventsContainer.append($eventsHeader);
    $eventsContainer.append($eventsList);

    // Começa recolhida por padrão
    $eventsList.hide();
  } else {
    $eventsContainer.hide();
  }
  // Galeria
  const $galleryContainer = $window.find(".project-gallery");
  $galleryContainer.empty();

  if (data.gallery && data.gallery.length > 0) {
    data.gallery.forEach((src, index) => {
      const angle = (Math.random() * 6 - 3).toFixed(2);
      const $imgWrapper = $("<div>").addClass("image-wrapper").css("position", "relative");
      const $img = $("<img>")
      .attr("src", src)
      .css("transform", `rotate(${angle}deg)`)
      .on("click", function () {
        const isExpanded = $(this).hasClass("expanded");
        $galleryContainer.find("img").removeClass("expanded");
        $galleryContainer.find(".image-wrapper").removeClass("expanded");

        if (!isExpanded) {
          $(this).addClass("expanded");
          $(this).closest(".image-wrapper").addClass("expanded");
        }
      });

      if (galleryExpanded && index === 0) {
        $img.addClass("expanded");
        $imgWrapper.addClass("expanded");
      }

      addImageLoader($img);
      $imgWrapper.append($img);
      $galleryContainer.append($imgWrapper);
    });
  }

  // Scroll para o topo
  $window.scrollTop(0);
}

// Fecha ao clicar no X ou no overlay
$(".close-btn, .overlay").on("click", closeProjectDetail);

// Fecha ao carregar Esc
$(document).on("keydown", function (e) {
  if (e.key === "Escape") {
    closeProjectDetail();
  }
});

function closeProjectDetail() {
  removeAllQueryParams();
  $(".project-detail").addClass("closing");
  $(".overlay").addClass("closing");

  setTimeout(() => {
    $(".overlay").removeClass("visible closing");
    $(".project-detail").removeClass("visible closing");
    $("body").css("overflow", "hidden auto");

    // Remove iframes de vídeo para parar a reprodução
    $(".media-container iframe").remove();
  }, 250);
}

$('nav a[href="#games"]').on('click', function(event) {
  scrollDown(event);
});

$(document).ready(function() {
  setTimeout(() => {
    scrollDown();
  }, 400);
});

function scrollDown(event) {
  const target = $('.navbar .site-branding');

  $(".project-detail").scrollTop(0);
  if (target.length) {
    event?.preventDefault();
    $('html, body').animate({
      scrollTop: target.offset().top
    }, 800); // 800ms de duração
  }
}


function getYouTubeID(url) {
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}
