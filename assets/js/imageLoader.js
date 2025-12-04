function addImageLoader($img) {
  // Cria spinner antes da imagem
  const $spinner = $("<div>")
  .addClass("img-spinner")
  .insertBefore($img);

  $img.hide(); // invisível

  $img.on("load", function () {
    $spinner.remove();
    $img.fadeIn(400); // aparece suavemente
  });

  // Se já tiver carregada (cache)
  if ($img[0].complete) {
    $img.trigger("load");
  }
}

$("img").each(function () {
  const $img = $(this);

  addImageLoader($img);
});
