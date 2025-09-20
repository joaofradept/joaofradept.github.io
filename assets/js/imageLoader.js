function addImageLoader($img) {
  // Cria spinner antes da imagem
  const $spinner = $("<div>")
  .addClass("img-spinner")
  .insertBefore($img);

  $img.hide();

  $img.on("load", function () {
    $spinner.remove();
    $img.fadeIn(400);
  });

  // Se já tiver carregada (cache)
  if ($img[0].complete) {
    $img.trigger("load");
  }
}

$("img").each(function () {
  const $img = $(this);

  // Cria um spinner/placeholder
  const $spinner = $("<div>")
  .addClass("img-spinner")
  .insertBefore($img);

  $img.hide(); // esconde a imagem até estar pronta

  $img.on("load", function () {
    $spinner.remove();   // remove o spinner
    $img.fadeIn(400);    // aparece suavemente
  });

  // Se a imagem já estiver em cache
  if ($img[0].complete) {
    $img.trigger("load");
  }
});
