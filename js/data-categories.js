/**
 * data-categories.js
 * -------------------
 * Definición central de categorías del tablero.
 * Agregar una categoría nueva = agregar un objeto acá + sus preguntas en
 * data-questions.js. El resto del sistema (tablero, tarjetas, panel lateral)
 * se adapta automáticamente.
 */

const CATEGORIES = {
  trabajo: {
    id: 'trabajo',
    name: 'Trabajo',
    icon: '💼',
    color: '#FF6B4A',
    colorSoft: 'rgba(255,107,74,0.16)',
    isStarCategory: true
  },
  equipo: {
    id: 'equipo',
    name: 'Equipo',
    icon: '🤝',
    color: '#2FD3C6',
    colorSoft: 'rgba(47,211,198,0.16)',
    isStarCategory: true
  },
  aprendizajes: {
    id: 'aprendizajes',
    name: 'Aprendizajes',
    icon: '📚',
    color: '#9B6BFF',
    colorSoft: 'rgba(155,107,255,0.16)',
    isStarCategory: true
  },
  anecdotas: {
    id: 'anecdotas',
    name: 'Anécdotas',
    icon: '😂',
    color: '#FFD23F',
    colorSoft: 'rgba(255,210,63,0.16)',
    isStarCategory: true
  },
  futuro: {
    id: 'futuro',
    name: 'Futuro',
    icon: '🚀',
    color: '#FF5FA2',
    colorSoft: 'rgba(255,95,162,0.16)',
    isStarCategory: true
  },
  random: {
    id: 'random',
    name: 'Random',
    icon: '🎲',
    color: '#4ADE80',
    colorSoft: 'rgba(74,222,128,0.16)',
    isStarCategory: true
  },
  especial: {
    id: 'especial',
    name: 'Especial',
    icon: '⭐',
    color: '#FFD700',
    colorSoft: 'rgba(255,215,0,0.18)',
    isStarCategory: false // casilla comodín: siempre entrega BONUS
  }
};

// Categorías que otorgan estrellas (excluye "especial")
const STAR_CATEGORY_IDS = Object.values(CATEGORIES)
  .filter(c => c.isStarCategory)
  .map(c => c.id);

const TOTAL_REQUIRED_STARS = STAR_CATEGORY_IDS.length * 3; // 18

function getCategory(id) {
  return CATEGORIES[id];
}
