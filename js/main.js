/**
 * main.js
 * -------
 * Punto de entrada. Conecta los botones de la interfaz y arranca la
 * partida apenas carga la página.
 */

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('rollBtn').addEventListener('click', handleRollClick);
  document.getElementById('endGameBtn').addEventListener('click', handleEndGameClick);
  startGame();
});
