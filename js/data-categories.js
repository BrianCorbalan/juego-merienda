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
    color: '#A9673A', // Marrón
    colorSoft: 'rgba(169,103,58,0.18)',
    isStarCategory: true
  },
  equipo: {
    id: 'equipo',
    name: 'Equipo',
    icon: '🤝',
    color: '#3DDC84', // Verde
    colorSoft: 'rgba(61,220,132,0.18)',
    isStarCategory: true
  },
  aprendizajes: {
    id: 'aprendizajes',
    name: 'Aprendizajes',
    icon: '📚',
    color: '#3B82F6', // Azul
    colorSoft: 'rgba(59,130,246,0.18)',
    isStarCategory: true
  },
  anecdotas: {
    id: 'anecdotas',
    name: 'Anécdotas',
    icon: '😂',
    color: '#FF7A29', // Naranja
    colorSoft: 'rgba(255,122,41,0.18)',
    isStarCategory: true
  },
  futuro: {
    id: 'futuro',
    name: 'Futuro',
    icon: '🚀',
    color: '#8B5CF6', // Violeta
    colorSoft: 'rgba(139,92,246,0.18)',
    isStarCategory: true
  },
  random: {
    id: 'random',
    name: 'Random',
    icon: '🎲',
    color: '#FF4D4D', // Rojo
    colorSoft: 'rgba(255,77,77,0.18)',
    isStarCategory: true
  },
  especial: {
    id: 'especial',
    name: 'Especial',
    icon: '⭐',
    color: '#FFD700', // Amarillo
    colorSoft: 'rgba(255,215,0,0.2)',
    isStarCategory: false // Nunca entrega estrella propia: abre popup de elección
  },
  salida: {
    id: 'salida',
    name: 'Salida / Llegada',
    icon: '🏁',
    color: '#F5E9D9', // Blanco cálido / crema
    colorSoft: 'rgba(245,233,217,0.22)',
    isStarCategory: false // Igual que Especial, pero también se activa al pasar de largo
  }
};

// Categorías que otorgan estrellas (excluye "especial" y "salida")
const STAR_CATEGORY_IDS = Object.values(CATEGORIES)
  .filter(c => c.isStarCategory)
  .map(c => c.id);

const TOTAL_REQUIRED_STARS = STAR_CATEGORY_IDS.length * 3; // 18

function getCategory(id) {
  return CATEGORIES[id];
}
