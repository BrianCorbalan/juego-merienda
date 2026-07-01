/**
 * dice.js
 * -------
 * Lógica y animación del dado virtual. Devuelve una Promise que resuelve
 * con el valor final (1-6) una vez terminada la animación (~1s).
 */

const DICE_FACES = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

function rollDiceValue() {
  return 1 + Math.floor(Math.random() * 6);
}

/**
 * Anima el cubo del dado durante ~1000ms mostrando caras aleatorias
 * intermedias, y termina mostrando el valor final.
 */
function animateDice(diceEl, finalValue) {
  return new Promise(resolve => {
    diceEl.classList.add('rolling');
    const totalDuration = 1000;
    const tickInterval = 80;
    let elapsed = 0;

    const tick = setInterval(() => {
      elapsed += tickInterval;
      const randFace = 1 + Math.floor(Math.random() * 6);
      setDiceFace(diceEl, randFace);

      if (elapsed >= totalDuration) {
        clearInterval(tick);
        setDiceFace(diceEl, finalValue);
        diceEl.classList.remove('rolling');
        diceEl.classList.add('landed');
        setTimeout(() => diceEl.classList.remove('landed'), 350);
        resolve(finalValue);
      }
    }, tickInterval);
  });
}

function setDiceFace(diceEl, value) {
  const faceEl = diceEl.querySelector('.dice-face');
  faceEl.textContent = DICE_FACES[value];
  faceEl.setAttribute('data-value', value);
}
