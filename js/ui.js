/**
 * ui.js
 * -----
 * Todo el renderizado del DOM vive acá. No contiene reglas de juego,
 * solo "dibuja" lo que state.js/board.js describen, y expone helpers
 * genéricos de overlays (popups/cartas) que game.js orquesta.
 */

const UI = {
  boardEl: null,
  playerListEl: null,
  overlayLayerEl: null,
  turnChipEmojiEl: null,
  turnChipNameEl: null,
  rollBtn: null,
  diceCube: null
};

function initUI() {
  UI.boardEl = document.getElementById('board');
  UI.playerListEl = document.getElementById('playerList');
  UI.overlayLayerEl = document.getElementById('overlayLayer');
  UI.turnChipEmojiEl = document.getElementById('turnChipEmoji');
  UI.turnChipNameEl = document.getElementById('turnChipName');
  UI.rollBtn = document.getElementById('rollBtn');
  UI.diceCube = document.getElementById('diceCube');

  renderBoardCells();
  renderSidePanel();
  updateTurnChip(getCurrentPlayer());
  renderTokens();
}

/* ============================= TABLERO ============================= */

function renderBoardCells() {
  UI.boardEl.innerHTML = '';
  UI.boardEl.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;
  UI.boardEl.style.gridTemplateRows = `repeat(${BOARD_SIZE}, 1fr)`;

  // Centro decorativo del tablero
  const center = document.createElement('div');
  center.className = 'board-center';
  center.style.gridRow = `2 / ${BOARD_SIZE}`;
  center.style.gridColumn = `2 / ${BOARD_SIZE}`;
  center.innerHTML = `<div class="board-center-logo">🎲<span>Vuelta al<br>Año</span></div>`;
  UI.boardEl.appendChild(center);

  BOARD_CELLS.forEach(cell => {
    const cat = getCategory(cell.categoryId);
    const cellEl = document.createElement('div');
    cellEl.className = `cell cell-${cat.id}`;
    cellEl.style.gridRow = String(cell.row);
    cellEl.style.gridColumn = String(cell.col);
    cellEl.style.setProperty('--cell-color', cat.color);
    cellEl.style.setProperty('--cell-color-soft', cat.colorSoft);
    cellEl.dataset.index = String(cell.index);

    cellEl.innerHTML = `
      <span class="cell-watermark">${cat.icon}</span>
      <div class="cell-tokens" data-role="tokens"></div>
    `;
    UI.boardEl.appendChild(cellEl);
  });
}

function getCellElement(index) {
  return UI.boardEl.querySelector(`.cell[data-index="${index}"]`);
}

function renderTokens() {
  // limpiar
  UI.boardEl.querySelectorAll('.cell-tokens').forEach(el => (el.innerHTML = ''));

  // agrupar jugadores por casilla
  const byCell = {};
  GameState.players.forEach(p => {
    (byCell[p.position] = byCell[p.position] || []).push(p);
  });

  Object.entries(byCell).forEach(([index, players]) => {
    const container = getCellElement(index)?.querySelector('[data-role="tokens"]');
    if (!container) return;
    players.forEach((p, i) => {
      const tokenEl = document.createElement('div');
      tokenEl.className = 'token';
      tokenEl.dataset.playerId = p.id;
      tokenEl.style.setProperty('--token-color', p.tokenColor);
      tokenEl.style.setProperty('--token-offset', String(i));
      tokenEl.textContent = p.emoji;
      container.appendChild(tokenEl);
    });
  });
}

function getTokenElement(playerId) {
  return UI.boardEl.querySelector(`.token[data-player-id="${playerId}"]`);
}

/** Anima el token del jugador un solo paso hacia la casilla `toIndex`. */
function bumpTokenAtCell(playerId) {
  const el = getTokenElement(playerId);
  if (!el) return;
  el.classList.remove('token-hop');
  // reflow para poder re-disparar la animación
  void el.offsetWidth;
  el.classList.add('token-hop');
}

/* =========================== PANEL LATERAL =========================== */

function renderSidePanel() {
  UI.playerListEl.innerHTML = '';
  GameState.players.forEach(p => {
    const card = document.createElement('div');
    card.className = 'player-card';
    card.dataset.playerId = p.id;
    card.innerHTML = `
      <div class="pc-head">
        <span class="pc-emoji">${p.emoji}</span>
        <span class="pc-name">${p.name}</span>
      </div>
      <div class="pc-stars" data-role="stars"></div>
    `;
    UI.playerListEl.appendChild(card);
  });
  updateSidePanelStars();
}

function updateSidePanelStars() {
  GameState.players.forEach(p => {
    const card = UI.playerListEl.querySelector(`.player-card[data-player-id="${p.id}"]`);
    if (!card) return;
    const starsWrap = card.querySelector('[data-role="stars"]');
    starsWrap.innerHTML = STAR_CATEGORY_IDS.map(catId => {
      const cat = getCategory(catId);
      const filled = p.stars[catId];
      const starChars = '⭐'.repeat(filled) + '☆'.repeat(3 - filled);
      return `<div class="pc-star-row"><span class="pc-star-icon">${cat.icon}</span><span class="pc-star-chars">${starChars}</span></div>`;
    }).join('');

    card.classList.toggle('is-current', p.id === getCurrentPlayer().id);
    card.classList.toggle('is-finished', playerHasAllStars(p));
  });
}

function updateTurnChip(player) {
  UI.turnChipEmojiEl.textContent = player.emoji;
  UI.turnChipNameEl.textContent = player.name;
  updateSidePanelStars();
}

/* ============================= OVERLAYS ============================= */

function cloneTemplate(templateId) {
  const tpl = document.getElementById(templateId);
  return tpl.content.firstElementChild.cloneNode(true);
}

function showOverlayEl(el) {
  UI.overlayLayerEl.appendChild(el);
  // forzar reflow para animación de entrada
  void el.offsetWidth;
  el.classList.add('visible');
  return el;
}

function hideOverlayEl(el) {
  return new Promise(resolve => {
    el.classList.remove('visible');
    el.classList.add('leaving');
    setTimeout(() => {
      el.remove();
      resolve();
    }, 260);
  });
}

/** Popup grande de turno: aparece, espera ~1s, desaparece solo. */
function showTurnPopup(player) {
  return new Promise(resolve => {
    const el = cloneTemplate('tpl-turn-popup');
    el.querySelector('[data-role="name"]').textContent = player.name;
    el.querySelector('[data-role="emoji"]').textContent = player.emoji;
    showOverlayEl(el);
    setTimeout(async () => {
      await hideOverlayEl(el);
      resolve();
    }, 1000);
  });
}

/** Carta grande de pregunta principal. Resuelve cuando el moderador confirma. */
function showMainQuestionCard(categoryId, questionText, starsAfter) {
  return new Promise(resolve => {
    const cat = getCategory(categoryId);
    const el = cloneTemplate('tpl-main-card');
    const card = el.querySelector('[data-role="card"]');
    card.style.setProperty('--card-color', cat.color);
    el.querySelector('[data-role="icon"]').textContent = cat.icon;
    el.querySelector('[data-role="category"]').textContent = cat.name;
    el.querySelector('[data-role="question"]').textContent = questionText;
    el.querySelector('[data-role="stars"]').textContent =
      '⭐'.repeat(starsAfter) + '☆'.repeat(3 - starsAfter);

    el.querySelector('[data-action="confirm"]').addEventListener('click', async () => {
      await hideOverlayEl(el);
      resolve();
    }, { once: true });

    showOverlayEl(el);
  });
}

/** Carta bonus. Resuelve con true/false según el resultado elegido por el moderador. */
function showBonusCard(questionText) {
  return new Promise(resolve => {
    const el = cloneTemplate('tpl-bonus-card');
    el.querySelector('[data-role="question"]').textContent = questionText;

    el.querySelector('[data-action="correct"]').addEventListener('click', async () => {
      await hideOverlayEl(el);
      resolve(true);
    }, { once: true });
    el.querySelector('[data-action="incorrect"]').addEventListener('click', async () => {
      await hideOverlayEl(el);
      resolve(false);
    }, { once: true });

    showOverlayEl(el);
  });
}

/** Ventana "Elegí una categoría" al completar una vuelta. Resuelve con el id elegido. */
function showLapChoiceCard(availableCategoryIds) {
  return new Promise(resolve => {
    const el = cloneTemplate('tpl-lap-choice');
    const optionsWrap = el.querySelector('[data-role="options"]');
    availableCategoryIds.forEach(catId => {
      const cat = getCategory(catId);
      const btn = document.createElement('button');
      btn.className = 'lap-option';
      btn.style.setProperty('--opt-color', cat.color);
      btn.innerHTML = `<span class="lap-option-icon">${cat.icon}</span><span>${cat.name}</span>`;
      btn.addEventListener('click', async () => {
        await hideOverlayEl(el);
        resolve(catId);
      }, { once: true });
      optionsWrap.appendChild(btn);
    });
    showOverlayEl(el);
  });
}

/** Micro-popup "¡Estrella conseguida!" (breve, decorativo). */
function showStarBurst() {
  return new Promise(resolve => {
    const el = cloneTemplate('tpl-star-burst');
    showOverlayEl(el);
    setTimeout(async () => {
      await hideOverlayEl(el);
      resolve();
    }, 850);
  });
}

/** Micro-popup "¡Categoría completa!" */
function showCategoryComplete(categoryId) {
  return new Promise(resolve => {
    const cat = getCategory(categoryId);
    const el = cloneTemplate('tpl-category-complete');
    el.querySelector('[data-role="icon"]').textContent = cat.icon;
    showOverlayEl(el);
    setTimeout(async () => {
      await hideOverlayEl(el);
      resolve();
    }, 950);
  });
}

/* ============================ PANTALLA FINAL ============================ */
function showFinalScreen() {
  return new Promise(resolve => {
    const el = cloneTemplate('tpl-final');
    const ranking = [...GameState.players].sort((a, b) => b.coins - a.coins);
    const medals = ['🥇', '🥈', '🥉'];
    const rankingWrap = el.querySelector('[data-role="ranking"]');
    rankingWrap.innerHTML = ranking.map((p, i) => `
      <div class="ranking-row ${i === 0 ? 'is-winner' : ''}">
        <span class="ranking-medal">${medals[i] || `#${i + 1}`}</span>
        <span class="ranking-emoji">${p.emoji}</span>
        <span class="ranking-name">${p.name}</span>
        <span class="ranking-coins">🪙 ${p.coins}</span>
      </div>
    `).join('');

    el.querySelector('[data-action="close"]').addEventListener('click', () => {
      resolve();
    }, { once: true });

    showOverlayEl(el);
  });
}

function setRollButtonEnabled(enabled, label) {
  UI.rollBtn.disabled = !enabled;
  if (label) UI.rollBtn.textContent = label;
}
