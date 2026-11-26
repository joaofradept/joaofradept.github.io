/* =========================================================
   João Frade — preview "o meu PC antigo"
   Interacções: modal, galeria, som opcional, easter egg.
   Depende de gameData.js, projectData.js e tagDefinitions.js.
   ========================================================= */

(function () {
  "use strict";

  const GAMES = typeof gameData !== "undefined" ? gameData : {};
  const PROJECTS = typeof projectData !== "undefined" ? projectData : {};
  const TAGS = typeof tagDefinitions !== "undefined" ? tagDefinitions : {};

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const overlay = $("#overlay");
  const modal = $("#modal");
  const modalKicker = $("#modal-kicker");
  const modalTitle = $("#modal-title");
  const modalMedia = $(".modal-media", modal);
  const modalBody = $(".modal-body", modal);
  const modalGallery = $(".modal-gallery", modal);
  const modalClose = $("#modal-close");
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightbox-img");
  const bubble = $("#bubble");
  const win = $("#janela");

  let lastFocus = null;

  /* -------------------------------------------------------
     Som opcional (sintetizado, sem ficheiros)
     ------------------------------------------------------- */

  const soundToggle = $("#sound-toggle");
  let audioCtx = null;
  let soundOn = false;

  try {
    soundOn = localStorage.getItem("jf-sound") === "on";
  } catch (e) {
    soundOn = false;
  }

  function renderSoundState() {
    if (!soundToggle) return;
    soundToggle.setAttribute("aria-pressed", String(soundOn));
    soundToggle.title = soundOn ? "Desligar os barulhinhos" : "Ligar os barulhinhos";
    const icon = $("i", soundToggle);
    if (icon) icon.className = soundOn ? "fa-solid fa-volume-high" : "fa-solid fa-volume-xmark";
  }

  function blip(freq = 480) {
    if (!soundOn) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === "suspended") audioCtx.resume();

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "square";
      osc.frequency.value = freq;
      gain.gain.value = 0.035;
      osc.connect(gain).connect(audioCtx.destination);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.07);
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
      /* sem som, sem drama */
    }
  }

  renderSoundState();

  if (soundToggle) {
    soundToggle.addEventListener("click", () => {
      soundOn = !soundOn;
      try {
        localStorage.setItem("jf-sound", soundOn ? "on" : "off");
      } catch (e) { /* ignorar */ }
      renderSoundState();
      if (soundOn) blip(620);
    });
  }

  /* -------------------------------------------------------
     Utilidades
     ------------------------------------------------------- */

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function parseYouTube(url) {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|[?&]v=|embed\/)([A-Za-z0-9_-]{11})/);
    return match ? match[1] : null;
  }

  function paragraphs(text) {
    return (text || "")
      .split(/\n\n+/)
      .map((t) => t.replace(/\s*\n\s*/g, " ").trim())
      .filter(Boolean);
  }

  const LINK_META = {
    windows: { label: "Windows", icon: "fa-brands fa-windows" },
    mac: { label: "macOS", icon: "fa-brands fa-apple" },
    linux: { label: "Linux", icon: "fa-brands fa-linux" },
    android: { label: "Android", icon: "fa-brands fa-android" },
    web: { label: "Jogar no browser", icon: "fa-solid fa-globe" },
    itch: { label: "itch.io", icon: "fa-brands fa-itch-io" },
    article: { label: "Ler o artigo (PDF)", icon: "fa-solid fa-file-pdf" }
  };

  function buildMedia(entry, id) {
    modalMedia.innerHTML = "";
    modalMedia.classList.remove("has-video");

    const videoId = parseYouTube(entry.video);
    if (videoId) {
      const iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube.com/embed/" + videoId + "?rel=0";
      iframe.title = entry.title || id;
      iframe.loading = "lazy";
      iframe.allow = "accelerometer; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      modalMedia.appendChild(iframe);
      modalMedia.classList.add("has-video");
      return;
    }

    const candidates = Array.from(
      new Set(
        []
          .concat(entry.gallery || [])
          .concat(entry.image ? [entry.image] : [])
          .concat(["assets/images/" + id + ".webp"])
          .filter(Boolean)
      )
    );

    if (!candidates.length) return;

    const img = document.createElement("img");
    img.alt = entry.title || id;
    let index = 0;
    img.addEventListener("error", () => {
      index += 1;
      if (index < candidates.length) {
        img.src = candidates[index];
      } else {
        img.remove();
      }
    });
    img.src = candidates[0];
    modalMedia.appendChild(img);
  }

  function buildTags(entry) {
    const keys = (entry.tags || []).filter((key) => TAGS[key]);
    if (!keys.length) return null;

    const wrap = el("div", "modal-tags");
    keys.forEach((key) => {
      const def = TAGS[key];
      const chip = el("span", "modal-tag", def.label || key);
      chip.dataset.type = def.type || "role";
      wrap.appendChild(chip);
    });
    return wrap;
  }

  function buildEvents(entry) {
    const group = entry.events;
    if (!group || !Array.isArray(group.list) || !group.list.length) return null;

    const wrap = el("div", "modal-events");
    if (group.title) wrap.appendChild(el("h4", null, group.title));

    const list = el("ul");
    group.list.forEach((item) => {
      const li = el("li");
      const titleParts = [item.title];
      if (item.date) titleParts.push(item.date);
      if (item.location) titleParts.push(item.location);
      li.appendChild(el("div", "ev-title", titleParts.filter(Boolean).join(" · ")));
      if (item.description) li.appendChild(el("div", "ev-desc", item.description));

      if (item.link && item.link.url) {
        const a = el("a", "ev-link", item.link.title || "Ver mais");
        a.href = item.link.url;
        if (item.link.target) a.target = item.link.target;
        if (item.link.target === "_blank") a.rel = "noopener";
        a.addEventListener("click", () => blip(560));
        li.appendChild(a);
      }
      list.appendChild(li);
    });
    wrap.appendChild(list);
    return wrap;
  }

  function buildLinks(entry) {
    if (!Array.isArray(entry.links) || !entry.links.length) return null;

    const wrap = el("div", "modal-links");
    entry.links.forEach((link) => {
      if (!link || !link.url) return;
      const meta = LINK_META[link.type] || {
        label: link.type ? link.type : "Abrir",
        icon: "fa-solid fa-arrow-up-right-from-square"
      };
      const a = el("a");
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.innerHTML = '<i class="' + meta.icon + '" aria-hidden="true"></i>';
      a.appendChild(document.createTextNode(meta.label));
      a.addEventListener("click", () => blip(560));
      wrap.appendChild(a);
    });
    return wrap.childElementCount ? wrap : null;
  }

  function buildGallery(entry) {
    modalGallery.innerHTML = "";
    const images = (entry.gallery || []).filter(Boolean);
    modalGallery.hidden = images.length === 0;

    images.forEach((src) => {
      const btn = el("button", "gallery-thumb");
      btn.type = "button";
      btn.setAttribute("aria-label", "Ampliar imagem");
      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.loading = "lazy";
      btn.appendChild(img);
      btn.addEventListener("click", () => openLightbox(src, entry.title));
      modalGallery.appendChild(btn);
    });
  }

  /* -------------------------------------------------------
     Modal
     ------------------------------------------------------- */

  function openEntry(id) {
    const isGame = Object.prototype.hasOwnProperty.call(GAMES, id);
    const entry = isGame ? GAMES[id] : PROJECTS[id];
    if (!entry) return;

    lastFocus = document.activeElement;

    modalTitle.textContent = entry.title || id;
    modalKicker.textContent = isGame ? "Jogo" : "Projecto";

    buildMedia(entry, id);

    modalBody.innerHTML = "";
    paragraphs(entry.description).forEach((text) => {
      modalBody.appendChild(el("p", null, text));
    });

    const tags = buildTags(entry);
    if (tags) modalBody.appendChild(tags);

    const events = buildEvents(entry);
    if (events) modalBody.appendChild(events);

    const links = buildLinks(entry);
    if (links) modalBody.appendChild(links);

    buildGallery(entry);

    overlay.classList.remove("hidden");
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    modalClose.focus();
  }

  function closeModal() {
    overlay.classList.add("hidden");
    modal.classList.add("hidden");
    document.body.style.overflow = "";
    modalMedia.innerHTML = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  /* -------------------------------------------------------
     Lightbox
     ------------------------------------------------------- */

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.remove("hidden");
    lightbox.setAttribute("tabindex", "-1");
    lightbox.focus();
  }

  function closeLightbox() {
    lightbox.classList.add("hidden");
    lightboxImg.src = "";
  }

  /* -------------------------------------------------------
     Eventos globais
     ------------------------------------------------------- */

  $$("[data-open]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      blip(520);
      openEntry(trigger.dataset.open);
    });
  });

  $$(".dock-item[href]").forEach((link) => {
    link.addEventListener("click", () => blip(440));
  });

  overlay.addEventListener("click", closeModal);
  modalClose.addEventListener("click", closeModal);

  lightbox.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!lightbox.classList.contains("hidden")) {
      closeLightbox();
      return;
    }
    if (!modal.classList.contains("hidden")) closeModal();
  });

  // foco preso dentro do modal
  modal.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = $$(
      'button, a[href], iframe, [tabindex]:not([tabindex="-1"])',
      modal
    ).filter((node) => node.offsetParent !== null);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  /* -------------------------------------------------------
     Easter egg: fechar a janela
     ------------------------------------------------------- */

  function say(message) {
    if (!bubble) return;
    bubble.textContent = message;
    bubble.classList.remove("hidden");
    clearTimeout(say.timer);
    say.timer = setTimeout(() => bubble.classList.add("hidden"), 2200);
  }

  const tbClose = $("#tb-close");
  if (tbClose) {
    tbClose.addEventListener("click", () => {
      blip(300);
      win.classList.remove("shake");
      // força reinício da animação
      void win.offsetWidth;
      win.classList.add("shake");
      say("epa, não. A janela fica.");
    });
  }

  /* -------------------------------------------------------
     Dock activo conforme o scroll
     ------------------------------------------------------- */

  const sections = ["#destaques", "#mais", "#gaveta", "#sobre", "#contacto"]
    .map((sel) => $(sel))
    .filter(Boolean);

  const dockLinks = $$(".dock-item[href]");

  function setActive(hash) {
    dockLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === hash);
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive("#" + entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((section) => observer.observe(section));
  }
})();
