/**
 * main.js
 * -------
 * Punto de entrada. Usa delegación de eventos para los clicks, porque el
 * botón de tirar dado ahora se genera dinámicamente dentro del centro del
 * tablero (y se regenera cada vez que arranca una partida nueva).
 */

document.addEventListener('click', (e) => {
  if (e.target.closest('#rollBtn')) {
    handleRollClick();
  } else if (e.target.closest('#endGameBtn')) {
    handleEndGameClick();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  startGame();
});
