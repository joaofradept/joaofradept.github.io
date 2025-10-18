function showGameDetails(id) {
  const data = gameData[id];

  // ... seu código existente ...

  // ADICIONE ESTA PARTE DEPOIS DA DESCRIÇÃO
  const events = data.events || [];
  const $eventsContainer = $("#project-events");
  $eventsContainer.empty();

  if (events.length > 0) {
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

  // ... resto do seu código ...
}
