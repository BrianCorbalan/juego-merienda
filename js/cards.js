/**
 * cards.js
 * --------
 * Decide QUÉ pasa cuando una ficha cae en una casilla o completa una
 * vuelta, y aplica los cambios de estado correspondientes (estrellas,
 * monedas). Usa los popups de ui.js para mostrarlo.
 */

/**
 * Resuelve la casilla donde terminó de caer un jugador.
 *  - Categoría "especial"            -> siempre BONUS
 *  - Categoría con estrellas pendientes -> pregunta principal
 *  - Categoría ya completada (3/3)   -> BONUS
 */
async function resolveLandingCell(player, categoryId) {
  const cat = getCategory(categoryId);

  if (!cat.isStarCategory) {
    // Casilla ⭐ Especial: siempre bonus
    await runBonusFlow(player);
    return;
  }

  if (!categoryIsComplete(player, categoryId)) {
    await runMainQuestionFlow(player, categoryId);
  } else {
    await runBonusFlow(player);
  }
}

async function runMainQuestionFlow(player, categoryId) {
  const qIndex = player.nextMainIndex[categoryId];
  const questionText = getMainQuestion(categoryId, qIndex);
  if (questionText == null) {
    // Salvaguarda: no debería pasar si la categoría no está completa.
    await runBonusFlow(player);
    return;
  }

  const starsAfter = player.stars[categoryId] + 1;
  await showMainQuestionCard(categoryId, questionText, starsAfter);

  // Aplicar recompensa
  player.stars[categoryId] = starsAfter;
  player.nextMainIndex[categoryId] = qIndex + 1;
  player.coins += coinsForMainQuestion();

  updateSidePanelStars();
  await showStarBurst();

  if (categoryIsComplete(player, categoryId)) {
    await showCategoryComplete(categoryId);
  }
}

async function runBonusFlow(player) {
  const questionText = drawBonusQuestion();
  const correct = await showBonusCard(questionText);
  if (correct) {
    player.coins += coinsForBonus();
  }
}

/**
 * Se ejecuta al completar una vuelta. Si al jugador le faltan estrellas,
 * muestra la ventana "Elegí una categoría", responde automáticamente la
 * siguiente pregunta pendiente de esa categoría y otorga la estrella.
 */
async function runLapCompletionFlow(player, lapNumber) {
  const lapCoins = coinsForLap(lapNumber);
  player.coins += lapCoins;

  const pending = pendingCategoriesFor(player);
  if (pending.length === 0) return;

  const chosenCategoryId = await showLapChoiceCard(pending);
  const qIndex = player.nextMainIndex[chosenCategoryId];
  const questionText = getMainQuestion(chosenCategoryId, qIndex);
  const starsAfter = player.stars[chosenCategoryId] + 1;

  await showMainQuestionCard(chosenCategoryId, questionText, starsAfter);

  player.stars[chosenCategoryId] = starsAfter;
  player.nextMainIndex[chosenCategoryId] = qIndex + 1;
  player.coins += coinsForMainQuestion();

  updateSidePanelStars();
  await showStarBurst();

  if (categoryIsComplete(player, chosenCategoryId)) {
    await showCategoryComplete(chosenCategoryId);
  }
}
