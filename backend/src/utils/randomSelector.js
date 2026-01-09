/**
 * Amestecă aleatoriu elementele unui array folosind algoritmul Fisher-Yates
 * @param {Array} array - Array-ul de amestecat
 * @returns {Array} Array nou cu elemente amestecate aleatoriu
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Selectează aleatoriu evaluatori din lista de studenți
 * Exclude studenții specificați (de exemplu, proprietarul proiectului)
 * @param {Array<Object>} allStudents - Lista completă de studenți
 * @param {Array<number>} excludeIds - Lista de ID-uri de exclus din selecție
 * @param {number} count - Numărul de evaluatori de selectat
 * @returns {Array<Object>} Lista de evaluatori selectați aleatoriu
 */
function selectRandomEvaluators(allStudents, excludeIds, count) {
  const eligible = allStudents.filter(student => !excludeIds.includes(student.id));
  const shuffled = shuffleArray(eligible);
  return shuffled.slice(0, count);
}

module.exports = { shuffleArray, selectRandomEvaluators };
