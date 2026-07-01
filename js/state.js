/**
 * state.js
 * --------
 * Estado central de la partida. Nada de UI acá: solo datos + funciones
 * puras/mutadoras sobre esos datos. ui.js lee este estado para dibujar,
 * game.js lo modifica según las reglas.
 */

const GameState = {
  players: [],       // ver createPlayerState()
  currentPlayerIndex: 0,
  bonusPool: [],      // preguntas bonus disponibles (se van consumiendo)
  usedBonusQuestions: [],
  isGameOver: false,
  isRolling: false,
  isBusy: false        // true mientras hay animación/carta en curso (bloquea input)
};

function createPlayerState(rosterEntry) {
  const stars = {};
  const nextMainIndex = {};
  STAR_CATEGORY_IDS.forEach(catId => {
    stars[catId] = 0;
    nextMainIndex[catId] = 0;
  });

  return {
    id: rosterEntry.id,
    name: rosterEntry.name,
    emoji: rosterEntry.emoji,
    tokenColor: rosterEntry.tokenColor,
    position: 0,          // índice de casilla 0..27
    totalStepsWalked: 0,   // usado para detectar vueltas completas
    lapsCompleted: 0,
    stars,                 // { trabajo: 0-3, equipo: 0-3, ... }
    nextMainIndex,         // próxima pregunta principal pendiente por categoría
    coins: 0,
    finished: false         // true cuando completó las 18 estrellas
  };
}

function initGameState() {
  GameState.players = PLAYER_ROSTER.map(createPlayerState);
  GameState.currentPlayerIndex = 0;
  GameState.bonusPool = shuffleArray([...BONUS_QUESTIONS]);
  GameState.usedBonusQuestions = [];
  GameState.isGameOver = false;
  GameState.isRolling = false;
  GameState.isBusy = false;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getCurrentPlayer() {
  return GameState.players[GameState.currentPlayerIndex];
}

function advanceToNextPlayer() {
  GameState.currentPlayerIndex =
    (GameState.currentPlayerIndex + 1) % GameState.players.length;
}

function playerStarsTotal(player) {
  return STAR_CATEGORY_IDS.reduce((sum, catId) => sum + player.stars[catId], 0);
}

function playerHasAllStars(player) {
  return playerStarsTotal(player) >= TOTAL_REQUIRED_STARS;
}

function categoryIsComplete(player, categoryId) {
  return player.stars[categoryId] >= 3;
}

function allPlayersFinished() {
  return GameState.players.every(playerHasAllStars);
}

function pendingCategoriesFor(player) {
  return STAR_CATEGORY_IDS.filter(catId => !categoryIsComplete(player, catId));
}

/** Saca (y remueve) una pregunta bonus al azar del pool global. */
function drawBonusQuestion() {
  if (GameState.bonusPool.length === 0) {
    // Pool agotado (partida muy larga): reciclamos las usadas para no
    // frenar el juego, evitando repetir la última usada si es posible.
    GameState.bonusPool = shuffleArray([...GameState.usedBonusQuestions]);
    GameState.usedBonusQuestions = [];
  }
  const question = GameState.bonusPool.pop();
  GameState.usedBonusQuestions.push(question);
  return question;
}

/** Monedas por vuelta completada: 1ra=+1, 2da=+2, 3ra=+3, etc. */
function coinsForLap(lapNumber) {
  return lapNumber;
}

/** Monedas por pregunta principal respondida (ocultas hasta el final). */
function coinsForMainQuestion() {
  return 2;
}

/** Monedas por bonus correcta: variable para más sorpresa. */
function coinsForBonus() {
  return 1 + Math.floor(Math.random() * 3); // 1 a 3
}
