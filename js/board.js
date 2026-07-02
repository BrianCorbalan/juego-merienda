/**
 * board.js
 * --------
 * Genera el tablero FIJO de 28 casillas (7 "nuevas" casillas por lado,
 * recorriendo el perímetro de una grilla de 8x8). El tablero es siempre
 * exactamente igual entre partidas: nunca se genera al azar.
 *
 * Cada uno de los 4 lados contiene exactamente una casilla de cada
 * categoría (Trabajo, Equipo, Aprendizajes, Anécdotas, Futuro, Random,
 * Especial). El orden interno de cada lado varía para que el recorrido
 * se sienta dinámico.
 */

const BOARD_SIZE = 8; // grilla de referencia 8x8 -> perímetro = 28 casillas
const TOTAL_CELLS = 28;
const SALIDA_INDEX = 0; // la casilla de Salida/Llegada vive siempre en el índice 0

// Secuencia FIJA de categorías, exactamente como especificada:
// índice 0 = Salida/Llegada, luego 3 lados de 7 casillas y 1 lado de 6,
// cerrando el circuito de vuelta en Salida (índice 0).
const BOARD_CATEGORY_SEQUENCE = [
  'salida',                                                                          // 0
  'trabajo', 'equipo', 'especial', 'anecdotas', 'futuro', 'aprendizajes', 'random',   // 1-7
  'anecdotas', 'equipo', 'especial', 'trabajo', 'aprendizajes', 'futuro', 'random',   // 8-14
  'equipo', 'trabajo', 'especial', 'aprendizajes', 'futuro', 'anecdotas', 'random',   // 15-21
  'trabajo', 'futuro', 'especial', 'anecdotas', 'equipo', 'aprendizajes'              // 22-27
];

/**
 * Devuelve {row, col} (1-indexado, para CSS grid) de la casilla `index`
 * (0..27) caminando el perímetro de una grilla NxN en sentido horario,
 * comenzando en la esquina superior izquierda.
 */
function getCellGridPosition(index) {
  const N = BOARD_SIZE;
  const side = Math.floor(index / 7); // 0=arriba,1=derecha,2=abajo,3=izquierda
  const offset = index % 7;

  if (side === 0) {
    // arriba: fila 1, columnas 1..7 (izq -> der)
    return { row: 1, col: offset + 1 };
  } else if (side === 1) {
    // derecha: columna N, filas 1..7 (arriba -> abajo)
    return { row: offset + 1, col: N };
  } else if (side === 2) {
    // abajo: fila N, columnas N..2 (der -> izq)
    return { row: N, col: N - offset };
  } else {
    // izquierda: columna 1, filas N..2 (abajo -> arriba)
    return { row: N - offset, col: 1 };
  }
}

function buildBoard() {
  const cells = [];
  for (let i = 0; i < TOTAL_CELLS; i++) {
    const categoryId = BOARD_CATEGORY_SEQUENCE[i];
    const pos = getCellGridPosition(i);
    cells.push({
      index: i,
      categoryId,
      row: pos.row,
      col: pos.col
    });
  }
  return cells;
}

const BOARD_CELLS = buildBoard();

function getBoardCell(index) {
  return BOARD_CELLS[((index % TOTAL_CELLS) + TOTAL_CELLS) % TOTAL_CELLS];
}
