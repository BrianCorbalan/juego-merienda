/**
 * game.js
 * -------
 * Orquesta el flujo de un turno:
 *  1) popup de turno (permanece abierto hasta que el usuario toca)
 *  2) tirar dado (con cadena de re-tiro si sale 5)
 *  3) mover ficha casilla por casilla, mostrando el contador digital
 *     grande en el centro del tablero, y detectando cada vez que la
 *     ficha PASA POR o CAE EN la casilla de Salida/Llegada
 *  4) al terminar el movimiento, resolver la casilla final:
 *       - Especial   -> popup "Reclamar estrella / Volver a tirar"
 *       - Salida     -> ya se resolvió durante el movimiento
 *       - categoría  -> pregunta principal o bonus (cards.js)
 *  5) siguiente turno / fin de partida
 */

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startGame() {
  initGameState();
  initUI();
  await beginTurn();
}

async function beginTurn() {
  if (GameState.isGameOver) return;

  const player = getCurrentPlayer();
  updateTurnChip(player);
  resetDiceDisplay();

  GameState.isBusy = true;
  setRollButtonEnabled(false);
  await showTurnPopup(player); // se mantiene abierto hasta que el usuario toca "Tocá para comenzar"
  GameState.isBusy = false;
  setRollButtonEnabled(true, '🎲 Tirar dado');
}

async function handleRollClick() {
  if (GameState.isBusy || GameState.isGameOver) return;
  GameState.isBusy = true;
  setRollButtonEnabled(false);

  const player = getCurrentPlayer();
  await performPlayerMove(player);
  await endTurn(player);
}

/**
 * Ejecuta un tiro completo (con su cadena de "sacaste 5, tirá de nuevo")
 * y el movimiento resultante. Si en el camino el jugador elige "Volver a
 * tirar" (desde Especial o Salida), esta función se llama a sí misma de
 * forma recursiva para el mismo jugador, como si fuera un tiro extra.
 */
async function performPlayerMove(player) {
  let totalSteps = 0;
  let keepRolling = true;

  while (keepRolling) {
    const value = rollDiceValue();
    await animateDice(UI.diceCube, value);
    totalSteps += value;

    if (value === 5) {
      // No sigue solo: espera a que el usuario confirme el tiro extra.
      await showFiveBonusPopup(totalSteps);
    } else {
      keepRolling = false;
    }
  }

  // Se muestra el puntaje logrado y se deja un momento para poder verlo
  // bien antes de que la ficha arranque a moverse.
  showDigitalCounter(totalSteps);
  await wait(1100);

  const moveResult = await movePlayerStepsWithChecks(player, totalSteps);

  if (moveResult.rerolled) {
    await performPlayerMove(player);
    return;
  }

  hideDigitalCounter();

  const cell = getBoardCell(player.position);

  if (cell.categoryId === 'especial') {
    const choice = await showSpecialChoicePopup(player, 'especial');
    if (choice === 'reroll') {
      await performPlayerMove(player);
      return;
    }
    // 'claimed' o sin categorías pendientes: no hay nada más que hacer.
  } else if (cell.categoryId === 'salida') {
    // Ya se resolvió durante el recorrido (ver movePlayerStepsWithChecks),
    // incluso si la ficha terminó exactamente ahí.
  } else {
    await resolveLandingCell(player, cell.categoryId);
  }
}

/**
 * Mueve la ficha una casilla a la vez, actualizando el contador digital
 * grande. Cada vez que la ficha pisa o atraviesa la casilla de Salida
 * (índice 0), se detiene el recorrido, se otorgan las monedas de vuelta
 * y se muestra el popup de elección. Si el jugador elige "volver a
 * tirar", el resto del movimiento actual se descarta.
 */
async function movePlayerStepsWithChecks(player, steps) {
  let remaining = steps;

  while (remaining > 0) {
    player.position = (player.position + 1) % TOTAL_CELLS;
    player.totalStepsWalked += 1;
    remaining -= 1;

    renderTokens();
    bumpTokenAtCell(player.id);
    await wait(300);
    updateDigitalCounter(remaining);

    if (player.position === SALIDA_INDEX) {
      player.lapsCompleted += 1;
      player.coins += coinsForLap(player.lapsCompleted); // monedas ocultas

      hideDigitalCounter();
      const choice = await showSpecialChoicePopup(player, 'salida');

      if (choice === 'reroll') {
        return { rerolled: true };
      }

      if (remaining > 0) {
        showDigitalCounter(remaining);
      }
    }
  }

  return { rerolled: false };
}

async function endTurn(player) {
  if (playerHasAllStars(player)) {
    player.finished = true;
  }
  updateSidePanelStars();

  if (allPlayersFinished()) {
    await finishGame();
    return;
  }

  GameState.isBusy = false;
  advanceToNextPlayer();
  await beginTurn();
}

async function finishGame() {
  GameState.isGameOver = true;
  setRollButtonEnabled(false, '🎲 Tirar dado');
  await wait(400);
  await showFinalScreen();
}

async function handleEndGameClick() {
  if (GameState.isGameOver) return;
  GameState.isGameOver = true;
  setRollButtonEnabled(false, '🎲 Tirar dado');
  await showFinalScreen();
  // Permite empezar una nueva partida limpia tras cerrar el resumen.
  await startGame();
}
