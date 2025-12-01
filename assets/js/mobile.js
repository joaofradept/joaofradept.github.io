$(document).ready(function() {
  let menuIsOpen;

  $('.menu-toggle').click(function() {
    menuIsOpen = !menuIsOpen;

    const menu = $('.menu');

    if (menuIsOpen)
      menu.css('max-height', '500px'); // Posso alterar isto mais tarde para tornar dinâmico
    else
      menu.css('max-height', '0');

  });
});
