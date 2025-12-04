function addImageLoader($img) {
  // Criar wrapper se não existir
  if (!$img.parent().hasClass('img-wrapper')) {
    const $wrapper = $("<div>")
    .addClass("img-wrapper")
    .css({
      display: 'inline-block',
      position: 'relative',
      width: $img.width() || 'auto', // Tentar manter largura
         height: $img.height() || 'auto'
    });

    // Mover estilos dimensionais para o wrapper
    const imgWidth = $img.attr('width');
    const imgHeight = $img.attr('height');

    if (imgWidth) $wrapper.css('width', imgWidth + 'px');
    if (imgHeight) $wrapper.css('height', imgHeight + 'px');

    // Envolver a imagem
    $img.wrap($wrapper);

    // Adicionar classe de loading à imagem
    $img.addClass("img-loading");

    // Adicionar spinner ao wrapper
    $("<div>")
    .addClass("img-spinner")
    .appendTo($img.parent());
  }

  $img.on("load", function () {
    const $this = $(this);
    const $wrapper = $this.parent();

    // Remover spinner
    $wrapper.find('.img-spinner').remove();

    // Fazer fade in da imagem
    $this.removeClass('img-loading').css('opacity', 0);
    $this.animate({opacity: 1}, 400);

    // Ajustar wrapper ao tamanho natural da imagem
    $wrapper.css({
      width: $this.width() + 'px',
                 height: $this.height() + 'px'
    });
  });

  // Se já carregou
  if ($img[0].complete) {
    setTimeout(() => $img.trigger("load"), 0);
  }
}
