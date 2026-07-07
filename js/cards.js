/**
 * cards.js
 * --------
 * Decide QUÉ pasa cuando una ficha cae en una casilla de categoría normal
 * (con estrellas), y aplica los cambios de estado correspondientes
 * (estrellas, monedas). Usa los popups de ui.js para mostrarlo.
 *
 * Las casillas ⭐ Especial y 🏁 Salida/Llegada NO pasan por acá: tienen su
 * propio popup de elección (ver showSpecialChoicePopup en ui.js y su
 * orquestación en game.js), porque nunca entregan bonus ni preguntan
 * directamente — dejan elegir entre reclamar una estrella o volver a tirar.
 */

/**
 * Resuelve la casilla donde terminó de caer un jugador, para categorías
 * normales (con estrellas):
 *  - Categoría con estrellas pendientes -> pregunta principal
 *  - Categoría ya completada (3/3)      -> BONUS
 */
async function resolveLandingCell(player, categoryId) {
  if (!categoryIsComplete(player, categoryId)) {
    await runMainQuestionFlow(player, categoryId);
  } else {
    await runBonusFlow(player);
  }
}

async function runMainQuestionFlow(player, categoryId) {
  await claimStarViaPopup(player, categoryId);
}

async function runBonusFlow(player) {
  const bonusItem = drawBonusQuestion();
  const correct = await showBonusCard(bonusItem);
  if (correct) {
    player.coins += coinsForBonus(player);
  }
  // Si es incorrecto, no se otorga ninguna moneda.
}

/**
 * Responde automáticamente la siguiente pregunta pendiente de la
 * categoría elegida y otorga la estrella correspondiente. Reutilizado
 * tanto por categorías normales como por el popup de Especial/Salida.
 */
async function claimStarViaPopup(player, categoryId) {
  const qIndex = player.nextMainIndex[categoryId];
  const questionText = getMainQuestion(categoryId, qIndex);
  const starsAfter = player.stars[categoryId] + 1;

  await showMainQuestionCard(categoryId, questionText, starsAfter);

  player.stars[categoryId] = starsAfter;
  player.nextMainIndex[categoryId] = qIndex + 1;
  // Nota: las preguntas principales (de estrella) NO otorgan monedas.
  // Las monedas solo vienen de las bonus correctas y de completar vueltas.

  updateSidePanelStars();
  await showStarBurst();

  if (categoryIsComplete(player, categoryId)) {
    await showCategoryComplete(categoryId);
  }
}
