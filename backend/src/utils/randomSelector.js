// shuffle array random cu fisher-yates
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// selecteaza evaluatori random, exclude id-urile date
// returneaza lista de evaluatori
function selectRandomEvaluators(allStudents, excludeIds, count) {
  const eligible = allStudents.filter(student => !excludeIds.includes(student.id));
  const shuffled = shuffleArray(eligible);
  return shuffled.slice(0, count);
}

module.exports = { shuffleArray, selectRandomEvaluators };
