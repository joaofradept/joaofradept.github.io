$(".nav-link").on("click", function (e) {
  e.preventDefault();
  const target = $(this).data("target");

  $(".section").hide(); // esconde todas
  $("#" + target).fadeIn(); // mostra a escolhida
});

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
    showSection(link.dataset.target);
  });
});

$(document).ready(function () {
  $('nav ul li').click(function () {
    $('nav ul li').removeClass('active');
    $(this).addClass('active');
  });

  const $underline = $('.underline');
  const $menuItems = $('.menu ul li');

  function updateUnderline($item) {
    const offset = $item.position();
    const width = $item.outerWidth();
    $underline.css({
      left: offset.left,
      width: width
    });
  }

  // Inicializa com o item ativo
  const $initialActive = $('.menu ul li.active');
  if ($initialActive.length) updateUnderline($initialActive);

  $menuItems.on('click', function () {
    $menuItems.removeClass('active');
    $(this).addClass('active');
    updateUnderline($(this));
  });
});

$("#games .card").on("click", function () {
  const id = $(this).data("id");
  showWindowDetails(gameData, id);
});

$("#projects .card").on("click", function () {
  const id = $(this).data("id");
  showWindowDetails(projectData, id);
});

function showWindowDetails(gameData, id) {
  const data = gameData[id];

  $(id + " #project-title").text(data.title);
  $(id + " #project-description").text(data.description);

  const $mediaContainer = $(id + " #project-media-container");
  $mediaContainer.empty();
  const imageSrc = `assets/images/0_covers/${id}.webp`;

  // Renderiza os botões para acesso ao jogo
  renderDownloadIcons(data.links || []);

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

        // Renderiza os botões para acesso ao jogo
        renderDownloadIcons(data.links || []);
      });

    // Adiciona botão de play
    const $wrapper = $("<div>").addClass("video-thumb").css("position", "relative");
    const $playBtn = $("<div>").addClass("play-button");
    $wrapper.append($img).append($playBtn);

    addImageLoader($img);
    $mediaContainer.append($wrapper);
  } else {
    const $img = $("<img>")
      .attr("src", imageSrc)
      .attr("id", "project-image");

    addImageLoader($img);
    $mediaContainer.append($img);
    //$mediaContainer.append($("<img>").attr("src", imageSrc));
  }

  $("body").css("overflow", "hidden"); // BLOQUEIA O SCROLL
  $(".overlay").addClass("visible");
  $(".project-detail").addClass("visible");

  const tags = data.tags || [];
  const $tagContainer = $(id + " #project-tags");
  $tagContainer.empty();

  tags.forEach(tagKey => {
    let label, type, $tag;

    // Se for uma tag tipo "years:2023"
    if (tagKey.startsWith("years:")) {
      label = tagKey.split(":")[1]; // só o ano
      type = "year";
      $tag = $("<span>")
        .addClass("tag")
        .addClass(type)
        .text(label);
    } else {
      // Comportamento normal
      const tagInfo = tagDefinitions[tagKey];
      label = tagInfo?.label || tagKey;
      type = tagInfo?.type || "other";

      if (type === "project" && tagInfo.url) {
        $tag = $("<a>")
          .addClass("tag")
          .addClass(type)
          .attr("href", tagInfo.url)
          .attr("target", "_blank")
          .attr("rel", "noopener noreferrer")
          .text(label);
      } else {
        $tag = $("<span>")
          .addClass("tag")
          .addClass(type)
          .text(label);
      }
    }

    $tagContainer.append($tag);
  });

  const events = data.events || [];
  const $eventsContainer = $(id + " #project-events");
  $eventsContainer.empty();

  if (events.length > 0) {
    $eventsContainer.show(); // Garante que está visível
    $eventsContainer.append('<h4>Project Events & Participation</h4>');
    const $eventsList = $('<div class="events-list"></div>');

    events.forEach(event => {
      const $eventItem = $(`
        <div class="event-item ${event.type || ''}">
          <div class="event-icon">${event.icon || '📅'}</div>
          <div class="event-content">
            <div class="event-title">${event.title}</div>
            <div class="event-details">
              <span class="event-date">${event.date}</span>
              ${event.location ? `<span class="event-location">${event.location}</span>` : ''}
            </div>
          </div>
        </div>
      `);

      $eventsList.append($eventItem);
    });

    $eventsContainer.append($eventsList);
  } else {
    $eventsContainer.hide(); // Esconde se não houver eventos
  }

  // Remove qualquer galeria anterior
  $(".project-detail .project-gallery").remove();

  // Galeria de imagens
  if (data.gallery && data.gallery.length > 0) {
    const $gallery = $("<div>").addClass("project-gallery");
    data.gallery.forEach((src, index) => {
      const angle = (Math.random() * 6 - 3).toFixed(2); // entre -3º e 3º
      const $imgWrapper = $("<div>").addClass("image-wrapper");
      const $img = $("<img>")
        .attr("src", src)
        .css("transform", `rotate(${angle}deg)`)
        .on("click", function () {
          const isExpanded = $(this).hasClass("expanded");

          $gallery.find("img").removeClass("expanded");
          $gallery.find(".image-wrapper").removeClass("expanded");

          if (!isExpanded) {
            $(this).addClass("expanded");
            $(this).closest(".image-wrapper").addClass("expanded");
          }
        });

      if (index === 0) {
        $img.addClass("expanded");
        $imgWrapper.addClass("expanded");
      }

      addImageLoader($img);
      $imgWrapper.append($img);
      $gallery.append($imgWrapper);

    });
    $(".project-detail").append($gallery);
  }

  // O scroll volta ao topo
  $(".project-detail").scrollTop(0);
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
  removeQueryParam("game"); // remove o ?game=xyz da barra de endereços
  $(".project-detail").addClass("closing");
  $(".overlay").addClass("closing");

  setTimeout(() => {
    $(".overlay").removeClass("visible closing");
    $(".project-detail").removeClass("visible closing");
    $("body").css("overflow", "auto"); // volta o scroll
    // Remove iframe para parar o vídeo
    $("#project-media-container iframe").remove();
  }, 250); // igual à duração da animação
}

//a[href^="#"]
$('a[href="#games"]').on('click', function(event) {
  const target = $('.navbar .site-branding');

  $(".project-detail").scrollTop(0);
  if (target.length) {
    event.preventDefault();
    $('html, body').animate({
      scrollTop: target.offset().top
    }, 800); // 800ms de duração
  }
});


function getYouTubeID(url) {
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}
