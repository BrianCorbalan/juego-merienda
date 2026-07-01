/**
 * data-questions.js
 * -----------------
 * Preguntas principales por categoría. SIEMPRE 3 por categoría y SIEMPRE
 * se responden en este orden (índice 0, luego 1, luego 2). No se mezclan.
 *
 * Para agregar una categoría nueva con estrellas: agregala en
 * data-categories.js con isStarCategory:true y agregá acá su arreglo de
 * exactamente 3 preguntas.
 */

const MAIN_QUESTIONS = {
  trabajo: [
    '¿Qué proyecto disfrutaste más este año?',
    '¿Qué tarea sentís que hoy hacés mucho mejor que hace unos meses?',
    '¿Qué te gustaría hacer más seguido dentro del trabajo?'
  ],
  equipo: [
    '¿Qué compañero te ayudó alguna vez cuando lo necesitabas?',
    '¿Qué es algo que valorás del equipo?',
    '¿Qué hace que un día de trabajo sea bueno para vos?'
  ],
  aprendizajes: [
    '¿Qué aprendiste este año que no esperabas aprender?',
    '¿Qué desafío te enseñó más?',
    '¿Qué habilidad te gustaría desarrollar el próximo semestre?'
  ],
  anecdotas: [
    '¿Cuál fue el momento más divertido del año?',
    '¿Cuál fue la situación más inesperada que viviste trabajando?',
    '¿Qué cliente o comentario recordás con más gracia?'
  ],
  futuro: [
    '¿Qué te gustaría que pase de acá a fin de año?',
    '¿Hay algún proyecto o tipo de tarea que te gustaría hacer?',
    'Si pudieras cambiar una sola cosa del trabajo, ¿qué cambiarías?'
  ],
  random: [
    'Si el equipo fuera una película, ¿qué género sería?',
    '¿Qué canción describiría tu semana laboral?',
    '¿Qué superpoder elegirías para trabajar?'
  ]
};

function getMainQuestion(categoryId, index) {
  const list = MAIN_QUESTIONS[categoryId];
  if (!list) return null;
  return list[index] ?? null;
}
