/**
 * game.js
 * -------
 * Orquesta el flujo de un turno: popup de turno -> tirar dado -> mover
 * ficha casilla por casilla -> resolver vuelta(s) completada(s) ->
 * resolver casilla final -> siguiente turno / fin de partida.
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

  GameState.isBusy = true;
  setRollButtonEnabled(false);
  await showTurnPopup(player);
  GameState.isBusy = false;
  setRollButtonEnabled(true, '🎲 Tirar dado');
}

async function handleRollClick() {
  if (GameState.isBusy || GameState.isGameOver) return;
  GameState.isBusy = true;
  setRollButtonEnabled(false);

  const player = getCurrentPlayer();
  let totalSteps = 0;
  let keepRolling = true;

  while (keepRolling) {
    const value = rollDiceValue();
    await animateDice(UI.diceCube, value);
    totalSteps += value;

    if (value === 5) {
      setRollButtonEnabled(false, '🎲 ¡Sacaste 5! Tira de nuevo…');
      await wait(650);
    } else {
      keepRolling = false;
    }
  }

  setRollButtonEnabled(false, '🎲 Tirar dado');
  await movePlayerSteps(player, totalSteps);
  await resolveArrival(player);
  await endTurn(player);
}

async function movePlayerSteps(player, steps) {
  for (let s = 0; s < steps; s++) {
    player.position = (player.position + 1) % TOTAL_CELLS;
    player.totalStepsWalked += 1;
    renderTokens();
    bumpTokenAtCell(player.id);
    await wait(300);
  }
}

async function resolveArrival(player) {
  const newLaps = Math.floor(player.totalStepsWalked / TOTAL_CELLS);
  const lapsGained = newLaps - player.lapsCompleted;

  for (let i = 1; i <= lapsGained; i++) {
    const lapNumber = player.lapsCompleted + i;
    await runLapCompletionFlow(player, lapNumber);
  }
  player.lapsCompleted = newLaps;

  const cell = getBoardCell(player.position);
  await resolveLandingCell(player, cell.categoryId);
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
