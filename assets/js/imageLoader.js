function addImageLoader($img) {
  // Criar imagem temporária para obter dimensões
  const tempImg = new Image();

  tempImg.onload = function() {
    // Agora sabemos as dimensões reais
    const width = this.width;
    const height = this.height;

    // Criar placeholder com as dimensões corretas
    const $spinner = $("<div>")
    .addClass("img-spinner")
    .css({
      width: width + 'px',
      height: height + 'px',
      display: 'inline-block'
    })
    .insertBefore($img);

    $img.hide();

    $img.on("load", function() {
      $spinner.remove();
      $(this).css('opacity', 0).show().animate({opacity: 1}, 400);
    });

    // Se já carregou
    if ($img[0].complete) {
      setTimeout(() => $img.trigger("load"), 0);
    }
  };

  tempImg.src = $img.attr('src');
}

// Uso
$("img").each(function() {
  // Só aplicar se não tiver width/height definidos
  const $img = $(this);
  if (!$img.attr('width') && !$img.attr('height')) {
    addImageLoader($img);
  }
});
