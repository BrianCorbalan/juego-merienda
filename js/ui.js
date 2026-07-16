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
  diceCube: null,
  diceAssembly: null,
  digitalCounterEl: null
};

function initUI() {
  UI.boardEl = document.getElementById('board');
  UI.playerListEl = document.getElementById('playerList');
  UI.overlayLayerEl = document.getElementById('overlayLayer');
  UI.turnChipEmojiEl = document.getElementById('turnChipEmoji');
  UI.turnChipNameEl = document.getElementById('turnChipName');

  renderBoardCells();
  renderSidePanel();

  // El dado y el contador digital viven DENTRO del centro del tablero,
  // así que sus referencias solo existen luego de renderBoardCells().
  UI.rollBtn = document.getElementById('rollBtn');
  UI.diceCube = document.getElementById('diceCube');
  UI.diceAssembly = document.getElementById('diceAssembly');
  UI.digitalCounterEl = document.getElementById('digitalCounter');

  updateTurnChip(getCurrentPlayer());
  renderTokens();
}

/* ============================= TABLERO ============================= */

function renderBoardCells() {
  UI.boardEl.innerHTML = '';
  UI.boardEl.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;
  UI.boardEl.style.gridTemplateRows = `repeat(${BOARD_SIZE}, 1fr)`;

  // Centro del tablero: acá vive siempre el dado (nunca se mueve de ahí).
  const center = document.createElement('div');
  center.className = 'board-center';
  center.style.gridRow = `2 / ${BOARD_SIZE}`;
  center.style.gridColumn = `2 / ${BOARD_SIZE}`;
  center.innerHTML = `
    <div class="dice-assembly" id="diceAssembly">
      <div id="diceCube" class="dice-cube"><div class="dice-face">?</div></div>
      <button id="rollBtn" class="btn btn-primary btn-roll">🎲 Tirar dado</button>
    </div>
    <div id="digitalCounter" class="digital-counter"></div>
  `;
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

/** Popup grande de turno: aparece y permanece abierto hasta que el
 * usuario lo toca. Recién ahí se habilita el dado. */
function showTurnPopup(player) {
  return new Promise(resolve => {
    const el = cloneTemplate('tpl-turn-popup');
    el.querySelector('[data-role="name"]').textContent = player.name;
    el.querySelector('[data-role="emoji"]').textContent = player.emoji;
    const card = el.querySelector('.turn-popup');
    card.addEventListener('click', async () => {
      await hideOverlayEl(el);
      resolve();
    }, { once: true });
    showOverlayEl(el);
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

/** Carta bonus. Primero muestra solo la pregunta con un botón "Ver
 * respuesta"; recién al tocarlo se revela la respuesta y aparecen los
 * botones Correcto / Incorrecto. Resuelve con true/false según el
 * resultado elegido por el moderador. */
function showBonusCard(bonusItem) {
  return new Promise(resolve => {
    const el = cloneTemplate('tpl-bonus-card');
    el.querySelector('[data-role="question"]').textContent = bonusItem.q;

    const answerWrap = el.querySelector('[data-role="answer-wrap"]');
    const answerText = el.querySelector('[data-role="answer"]');
    const revealBtn = el.querySelector('[data-action="reveal"]');
    const revealActionsWrap = el.querySelector('[data-role="reveal-actions"]');
    const resultActions = el.querySelector('[data-role="result-actions"]');

    revealBtn.addEventListener('click', () => {
      answerText.textContent = bonusItem.a;
      answerWrap.classList.add('visible');
      revealActionsWrap.remove();
      resultActions.classList.add('visible');
    }, { once: true });

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

/**
 * Popup que aparece cada vez que el dado saca un 5: informa el tiro extra
 * y muestra cuántos pasos lleva acumulados el jugador en esta tirada.
 * Permanece abierto hasta que el usuario toca "Tirar de nuevo".
 */
function showFiveBonusPopup(totalStepsSoFar) {
  return new Promise(resolve => {
    const el = cloneTemplate('tpl-five-popup');
    el.querySelector('[data-role="total"]').textContent =
      `Llevás ${totalStepsSoFar} ${totalStepsSoFar === 1 ? 'paso acumulado' : 'pasos acumulados'}`;

    el.querySelector('[data-action="reroll"]').addEventListener('click', async () => {
      await hideOverlayEl(el);
      resolve();
    }, { once: true });

    showOverlayEl(el);
  });
}

/**
 * Popup de las casillas ⭐ Especial y 🏁 Salida/Llegada. Permanece abierto
 * hasta que el usuario elige una opción:
 *  - Reclamar una estrella: solo se listan categorías con estrellas
 *    pendientes; al elegir una, responde automáticamente su siguiente
 *    pregunta y otorga la estrella (resuelve con 'claimed').
 *  - Volver a tirar: descarta lo que quede del turno y permite un tiro
 *    extra (resuelve con 'reroll').
 */
function showSpecialChoicePopup(player, kind) {
  return new Promise(resolve => {
    const cat = getCategory(kind);
    const el = cloneTemplate('tpl-special-popup');
    el.querySelector('[data-role="icon"]').textContent = cat.icon;
    el.querySelector('[data-role="title"]').textContent = cat.name;

    const optionsWrap = el.querySelector('[data-role="star-options"]');
    const pending = pendingCategoriesFor(player);

    if (pending.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'special-empty';
      empty.textContent = '¡Ya tenés todas las estrellas!';
      optionsWrap.appendChild(empty);
    } else {
      pending.forEach(catId => {
        const c = getCategory(catId);
        const btn = document.createElement('button');
        btn.className = 'lap-option';
        btn.style.setProperty('--opt-color', c.color);
        btn.innerHTML = `<span class="lap-option-icon">${c.icon}</span><span>${c.name}</span>`;
        btn.addEventListener('click', async () => {
          await hideOverlayEl(el);
          await claimStarViaPopup(player, catId);
          resolve('claimed');
        }, { once: true });
        optionsWrap.appendChild(btn);
      });
    }

    el.querySelector('[data-action="reroll"]').addEventListener('click', async () => {
      await hideOverlayEl(el);
      resolve('reroll');
    }, { once: true });

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
        ${i === 0 ? '<button class="btn btn-prize" data-action="prize">🎁 Premio</button>' : ''}
      </div>
    `).join('');

    const prizeBtn = rankingWrap.querySelector('[data-action="prize"]');
    if (prizeBtn) {
      prizeBtn.addEventListener('click', () => {
        showPrizePopup();
      });
    }

    el.querySelector('[data-action="close"]').addEventListener('click', () => {
      resolve();
    }, { once: true });

    showOverlayEl(el);
  });
}

/**
 * Popup del premio para el ganador: 3 opciones grandes y coloridas.
 * Al elegir una, se revela el resultado correspondiente (mensaje o
 * video) y recién ahí se puede cerrar el popup.
 */
function showPrizePopup() {
  const el = cloneTemplate('tpl-prize-popup');

  const optionsWrap = el.querySelector('[data-role="prize-options"]');
  const revealWrap = el.querySelector('[data-role="prize-reveal"]');
  const revealMessageEl = el.querySelector('[data-role="prize-reveal-message"]');
  const revealVideoEl = el.querySelector('[data-role="prize-reveal-video"]');

  const PRIZE_MESSAGES = {
    music: '🎉 ¡Felicitaciones, ganaste 1 día de música LIBRE!',
    alfajor: '🍫 Podés retirar el alfajor en la próxima merienda'
  };

  el.querySelectorAll('.prize-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const prizeKey = btn.dataset.prize;
      optionsWrap.style.display = 'none';

      if (prizeKey === 'box') {
        revealVideoEl.innerHTML =
          '<div class="prize-video-frame">' +
          '<video id="prizeCajaVideo" playsinline controls>' +
          '<source src="media/caja.mp4" type="video/mp4">' +
          'Tu navegador no soporta la reproducción de este video.' +
          '</video>' +
          '</div>';
        revealVideoEl.classList.add('visible');

        const videoEl = revealVideoEl.querySelector('video');

        videoEl.addEventListener('error', () => {
          revealVideoEl.insertAdjacentHTML(
            'beforeend',
            '<div class="prize-video-error">No se pudo cargar el video. ' +
            'Verificá que el archivo esté en <code>media/caja.mp4</code>, junto a este index.html.</div>'
          );
        });

        // Se dispara dentro del mismo click del usuario, así que la
        // mayoría de los navegadores permiten reproducir CON sonido
        // (sin necesidad de "muted"). Si algún navegador lo bloquea de
        // todos modos, reintentamos silenciado para que al menos arranque.
        try {
          videoEl.muted = false;
          const playPromise = videoEl.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {
              videoEl.muted = true;
              try { videoEl.play(); } catch (e) { /* noop */ }
            });
          }
        } catch (e) {
          // Algunos entornos pueden lanzar de forma sincrónica; el
          // usuario siempre puede darle play manual con los controles.
        }
      } else {
        revealMessageEl.textContent = PRIZE_MESSAGES[prizeKey] || '';
        revealMessageEl.classList.add('visible');
      }

      revealWrap.classList.add('visible');
    }, { once: true });
  });

  el.querySelector('[data-action="prize-close"]').addEventListener('click', async () => {
    await hideOverlayEl(el);
  }, { once: true });

  showOverlayEl(el);
}

/* ====================== DADO CENTRAL Y CONTADOR DIGITAL ====================== */

/** Muestra el número grande sobre el dado, en el centro del tablero. */
function showDigitalCounter(value) {
  UI.digitalCounterEl.textContent = String(value);
  UI.digitalCounterEl.classList.add('visible');
}

/** Actualiza el número mientras la ficha avanza casilla por casilla. */
function updateDigitalCounter(value) {
  UI.digitalCounterEl.textContent = String(value);
}

/** Oculta el contador (por ejemplo, al llegar a 0 o al interrumpir el
 * movimiento porque el jugador cayó en Salida). */
function hideDigitalCounter() {
  UI.digitalCounterEl.classList.remove('visible');
}

/** Vuelve a dejar el dado listo y visible para el próximo turno. */
function resetDiceDisplay() {
  hideDigitalCounter();
  UI.diceCube.querySelector('.dice-face').textContent = '?';
}

function setRollButtonEnabled(enabled, label) {
  UI.rollBtn.disabled = !enabled;
  if (label) UI.rollBtn.textContent = label;
}
